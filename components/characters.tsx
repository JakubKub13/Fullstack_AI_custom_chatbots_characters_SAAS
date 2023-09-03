import { Characters } from "@prisma/client";
import Image from "next/image";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

interface CharactersProps {
    data: (Characters & {
        _count: {
            messages: number;
        }
    })[];
}

export const Characters = ({
    data
}: CharactersProps) => {
    if(data.length === 0) {
        return (
            <div className="pt-10 flex flex-col items-center justify-center space-y-3">
                <div className="relative w-60 h-60">
                    <Image 
                        fill 
                        className="grayscale"
                        alt="Empty"
                        src="/placeholder.svg"
                    />
                </div>
                <p className="text-sm text-muted-foreground">
                    No characters found.
                </p>
            </div>
        )
    }


  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10">
        {data.map((item) => (
            <Card 
                key={item.id}
                className="bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0"
            >
                <Link href={`/chat/${item.id}`}>
                    <CardHeader className="flex item-center justify-center text-muted-foreground">
                        <div className="relative w-32 h-32">
                            <Image 
                                src={item.src}
                                fill 
                                className="rounded-xl object-cover"
                                alt="Character"
                            />
                        </div>
                        <p className="font-bold">
                            {item.name}
                        </p>
                        <p className="text-xs">
                            {item.description}
                        </p>
                    </CardHeader>
                    <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
                        <p>
                            @{item.username}
                        </p>
                        <div className="flex flex-center">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {item._count.messages}
                        </div>
                    </CardFooter>
                </Link>
            </Card>
        ))}
    </div>
  )
}

