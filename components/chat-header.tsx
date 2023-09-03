"use client"

import axios from "axios";
import { Characters, Message } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MessagesSquare, MoreVertical, Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { BotAvatar } from "@/components/bot-avatar";
import { useUser } from "@clerk/nextjs";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";


interface ChatHeaderProps {
    character: Characters & {
    messages: Message[];
    _count: {
        messages: number;
        };
    };
};

export const ChatHeader = ({
    character
}: ChatHeaderProps) => {

    const router = useRouter();
    const { user } = useUser();  
    const { toast } = useToast();

    const onDelete = async () => {
        try {
            await axios.delete(`/api/characters/${character.id}`)

            toast({
                description: "Character deleted.",
            });

            router.refresh();
            router.push("/");
        } catch (error) {
            toast({
                description: "Something went wrong.",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="flex w-full justify-between items-center border-b border-primary/10 pb-4">
            <div className="flex gap-x-2 items-center">
                <Button onClick={() => router.back()} size="icon" variant="ghost">
                    <ChevronLeft className="h-6 w-8" />
                </Button>
                <BotAvatar src={character.src}/>
                <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-x-2">
                        <p className="font-bold">
                            {character.name}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <MessagesSquare className="w-3 h-3 mr-1"/>
                            {character._count.messages}
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Created by {character.username}
                    </p>
                </div>
            </div>
            {user?.id === character.userId && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon">
                            <MoreVertical />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/characters/${character.id}`)}>
                            <Edit className="w-4 h-4 mr-2"/>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onDelete}>
                            <Trash className="w-4 h-4 mr-2"/>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    )
}