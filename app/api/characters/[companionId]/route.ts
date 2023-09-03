import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function PATCH(
    req: Request,
    { params }: { params: { companionId: string } }
    ) {
    try {
        const body = await req.json();
        const user = await currentUser();
        const { src, name, description, instructions, seed, categoryId } = body;

        if(!params.companionId) {
            return new NextResponse("Missing companionId", { status: 400 })
        }

        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if(!src || !name || !description || !instructions || !seed || !categoryId) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        // TODO check for subscription

        const character = await prismadb.characters.update({
            where: {
                id: params.companionId,
            },
            data: {
                categoryId,
                userId: user.id,
                username: user.firstName,
                src,
                name,
                description,
                instructions,
                seed,
            }
        });

        return NextResponse.json(character);

    } catch (error) {
        console.log("[Characters_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}

