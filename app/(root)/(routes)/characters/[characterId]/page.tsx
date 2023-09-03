import prismadb from "@/lib/prismadb";
import  { CharactersForm } from "./components/character-form";
import { auth, redirectToSignIn } from "@clerk/nextjs"


interface CharacterIdPageProps {
    params: {
        characterId: string;
    };
};

const CharacterIdPage = async ({
    params 
}: CharacterIdPageProps) => {
    const { userId } = auth();
    // TODO check subscription
    if (!userId) {
        return redirectToSignIn();
    }

    const character = await prismadb.characters.findUnique({
        where: {
            id: params.characterId,
            userId
        }
    });

    const categories = await prismadb.category.findMany();




  return (
    <CharactersForm 
        initialData={character}
        categories={categories}
    />
  )
}

export default CharacterIdPage