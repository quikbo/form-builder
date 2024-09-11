import {
  addDeck,
  decrementDeckCount,
  removeDeck,
  updateDeckTitle,
} from "@/lib/store";
import { createDeck, deleteDeck, updateDeck } from "@/data/api";
import { useToast } from "@/components/ui/use-toast";
import useAuth from "./use-auth";

const useMutationDecks = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const deleteDeckById = async (id: string) => {
    try {
      await deleteDeck(id);
      removeDeck(id);
      decrementDeckCount();
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error deleting the deck 🙁",
        description: errorMessage,
      });
    }
  };

  const updateDeckTitleById = async (id: string, title: string) => {
    try {
      if (!title) {
        throw new Error("Title cannot be empty!");
      }
      await updateDeck(id, title);
      updateDeckTitle(id, title);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sorry! There was an error updating the deck 🙁",
        description: (error as Error).message as string,
      });
    }
  };

  const addNewDeck = async (title: string) => {
    try {
      if (!title) {
        throw new Error("Title cannot be empty!");
      }
      const deck = await createDeck(title, 0);
      const deckWithAuthor = {
        id: deck.id,
        title: deck.title,
        numberOfCards: deck.numberOfCards,
        date: deck.date,
        author: {
          id: user.id,
          name: user.name,
          username: user.username,
        },
      };
      addDeck(deckWithAuthor);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sorry! There was an error adding a new deck 🙁",
        description: (error as Error).message as string,
      });
    }
  };

  return {
    deleteDeckById: deleteDeckById,
    updateDeckTitleById: updateDeckTitleById,
    addNewDeck: addNewDeck,
  };
};

export default useMutationDecks;
