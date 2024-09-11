import {
  $cards,
  setCards,
  setPageLimit,
  setTotalCardCount,
  setTotalCardPages,
} from "@/lib/store";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { fetchCards } from "@/data/api";
import { toast } from "@/components/ui/use-toast";

const useQueryCards = (deckId: string) => {
  const cards = useStore($cards);

  const loadCards = async (page: number = 1) => {
    try {
      const {
        data: fetchedCards,
        totalCards,
        totalPages,
        limit,
      } = await fetchCards(deckId, page);
      setPageLimit(limit);
      setTotalCardCount(totalCards);
      setTotalCardPages(totalPages);
      setCards([...fetchedCards]);
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: `Sorry! There was an error reading the cards from deck ${deckId} 🙁`,
        description: errorMessage,
      });
    }
  };

  useEffect(() => {
    loadCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckId]);

  return {
    cards,
    loadCards,
  };
};

export default useQueryCards;
