import prismadb from "@/lib/prismadb";
import  { CharactersForm } from "./components/character-form";


interface CharacterIdPageProps {
    params: {
        characterId: string;
    };
};

const CharacterIdPage = async ({
    params 
}: CharacterIdPageProps) => {
    // TODO check subscription

    const character = await prismadb.characters.findUnique({
        where: {
            id: params.characterId,
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