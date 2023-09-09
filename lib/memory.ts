import { Redis } from "@upstash/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export type CharactersKey = {
    characterName: string;
    modelName: string;
    userId: string;
};

export class MemoryManager {
    private static instance: MemoryManager;
    private history: Redis;
    private vectorDBClient: PineconeClient;

    public constructor() {
        this.history = Redis.fromEnv();
        this.vectorDBClient = new PineconeClient();
    }

    public async init() {
        if (this.vectorDBClient instanceof PineconeClient) {
            await this.vectorDBClient.init({
                apiKey: process.env.PINECONE_API_KEY!,
                environment: process.env.PINECONE_ENVIRONMENT!,
            });
        }
    }

    public async vectorSearch(
        recentChatHistory: string,
        characterFileName: string
    ) {
        const pineconeClient = <PineconeClient>this.vectorDBClient;
        const pineconeIndex = pineconeClient.Index(
            process.env.PINECONE_INDEX! || ""
        );

        const vectorStore = await PineconeStore.fromExistingIndex(
            new OpenAIEmbeddings({
                openAIApiKey: process.env.OPENAI_API_KEY }),
                { pineconeIndex }
        );

        const similarDocs = await vectorStore
            .similaritySearch(recentChatHistory, 3, { fileName: characterFileName })
            .catch((err) => {
                console.log("Failed to get vector search results: ", err);
         });
        return similarDocs;
    }

    public static async getInstance(): Promise<MemoryManager> {
        if (!MemoryManager.instance) {
            MemoryManager.instance = new MemoryManager();
            await MemoryManager.instance.init();
        }

        return MemoryManager.instance;
    }

    private generateRedisCharactersKey(charactersKey: CharactersKey): string {
        return `${charactersKey.characterName}-${charactersKey.modelName}-${charactersKey.userId}`
    }

    public async writeToHistory(text: string, charactersKey: CharactersKey) {
        if (!charactersKey || typeof charactersKey.userId == 'undefined') {
            console.log("Characters key is undefined");
            return "";
        }

        const key = this.generateRedisCharactersKey(charactersKey);
        const result = await this.history.zadd(key, {
            score: Date.now(),
            member: text,
        });

        return result;  
    }

    public async readLatestHistory(charactersKey: CharactersKey) {
        if (!charactersKey || typeof charactersKey.userId == 'undefined') {
            console.log("Characters key is undefined");
            return "";
        }

        const key = this.generateRedisCharactersKey(charactersKey);
        let result = await this.history.zrange(key, 0, Date.now(), {
            byScore: true,
        });

        result = result.slice(-30).reverse();
        const recentChats = result.reverse().join("\n");
        return recentChats;
    }

    public async seedChatHistory(
        seedContent: String,
        delimiter: string = "\n",
        charactersKey: CharactersKey
    ) {
        const key = this.generateRedisCharactersKey(charactersKey);

        if (await this.history.exists(key)) {
            console.log("Chat history already exists");
            return;
        }

        const content = seedContent.split(delimiter);
        let counter = 0;

        for (const line of content) {
            await this.history.zadd(key, {
                score: counter,
                member: line,
            });
            counter += 1;
        }
    }
}