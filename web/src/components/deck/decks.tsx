import { $currentPage, $totalDeckCount } from "@/lib/store";
import Paginator from "../shared/pagination";
import Deck from "./deck";
import useQueryDecks from "@/hooks/use-query-decks";
import { useEffect } from "react";
import { useStore } from "@nanostores/react";

const Decks = () => {
  const { decks, loadDecks } = useQueryDecks();
  const totalDeckCount = useStore($totalDeckCount);
  const curPage = useStore($currentPage);

  useEffect(() => {
    loadDecks(curPage);
  }, [totalDeckCount]);

  const loadDecksPage = (pageIndex: number) => {
    loadDecks(pageIndex);
  };

  if (decks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        There are no decks to display. Create one with the black plus button.
      </div>
    );
  } else {
    return (
      <Paginator loadPage={loadDecksPage}>
        {decks.map((deck) => (
          <Deck key={deck.id} deck={deck} />
        ))}
      </Paginator>
    );
  }
};

export default Decks;
