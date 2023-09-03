"use client"

import { Characters, Message } from "@prisma/client";
import { ChatHeader } from "@/components/chat-header";

interface ChatClientProps {
    character: Characters & {
    messages: Message[];
    _count: {
        messages: number;
        };
    };
};

export const ChatClient = ({
    character
}: ChatClientProps) => {

    return (
        <div className="flex flex-col h-full p-4 space-y-2">
            <ChatHeader character={character} />
        </div>
    )
}
