import {
  $decks,
  setDecks,
  setPageLimit,
  setTotalDeckCount,
  setTotalDeckPages,
} from "@/lib/store";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { fetchDecks } from "@/data/api";
import { toast } from "@/components/ui/use-toast";

const useQueryDecks = () => {
  const decks = useStore($decks);

  const loadDecks = async (page: number = 1) => {
    try {
      const {
        data: fetchedDecks,
        totalDecks,
        totalPages,
        limit,
      } = await fetchDecks(page);
      setPageLimit(limit);
      setTotalDeckCount(totalDecks);
      setTotalDeckPages(totalPages);
      setDecks([...fetchedDecks]);
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error reading the decks 🙁",
        description: errorMessage,
      });
    } finally {
    }
  };

  useEffect(() => {
    loadDecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    decks,
    loadDecks,
  };
};

export default useQueryDecks;
