import {
  addCard,
  decrementCardCount,
  incrementCardCount,
  removeCard,
  updateCardContent,
} from "@/lib/store";
import { createCard, deleteCard, updateCard } from "@/data/api";
import { useToast } from "@/components/ui/use-toast";
import useAuth from "./use-auth";

const useMutationCards = (deckId: string) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const deleteCardById = async (cardId: string) => {
    try {
      await deleteCard(deckId, cardId);
      removeCard(cardId);
      decrementCardCount();
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error deleting the card 🙁",
        description: errorMessage,
      });
    }
  };

  const updateCardContentById = async (
    cardId: string,
    front: string,
    back: string,
  ) => {
    try {
      if (!front && !back) {
        throw new Error("Front and back cannot be empty!");
      }
      await updateCard(deckId, cardId, front, back);
      updateCardContent(cardId, front, back);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sorry! There was an error updating the card 🙁",
        description: (error as Error).message as string,
      });
    }
  };

  const addNewCard = async (front: string, back: string) => {
    try {
      if (!front || !back) {
        throw new Error("Front and back cannot be empty!");
      }
      const card = await createCard(deckId, front, back);
      const cardWithAuthor = {
        id: card.id,
        front: card.front,
        back: card.back,
        date: card.date,
        deckId: card.deckId,
        author: {
          id: user.id,
          name: user.name,
          username: user.username,
        },
      };
      addCard(cardWithAuthor);
      incrementCardCount();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sorry! There was an error adding a new card 🙁",
        description: (error as Error).message as string,
      });
    }
  };

  return {
    deleteCardById,
    updateCardContentById,
    addNewCard,
  };
};

export default useMutationCards;
