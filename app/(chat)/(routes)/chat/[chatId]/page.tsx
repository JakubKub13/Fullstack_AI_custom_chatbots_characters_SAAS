import { auth, redirectToSignIn } from '@clerk/nextjs'
import prismadb from '@/lib/prismadb';
import { redirect } from "next/navigation"
import {ChatClient } from './components/client';

interface ChatIdPageProps {
    params: {
        chatId: string;
    }
}

const ChatIdPage = async ({
    params
}: ChatIdPageProps) => {
    const { userId } = auth()

    if(!userId) {
        return redirectToSignIn();
    }

    const character = await prismadb.characters.findUnique({
        where: {
            id: params.chatId
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: 'desc'
                },
                where: {
                    userId,
                }
            },
            _count: {
                select: {
                    messages: true
                }
            }
        }
    });

    if(!character) {
        return redirect("/")
    }



  return (
    <ChatClient character={character} />
  )
}

export default ChatIdPage