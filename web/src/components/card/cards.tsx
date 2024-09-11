import Paginator from "../shared/pagination";
import Card from "./card";
import useQueryCards from "@/hooks/use-query-cards";

const Cards = ({ deckId }: { deckId: string }) => {
  const { cards, loadCards } = useQueryCards(deckId);

  const loadCardsPage = (pageIndex: number) => {
    loadCards(pageIndex);
  };

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p>
          This deck has no cards to display. Create one with the red plus
          button.
        </p>
      </div>
    );
  } else {
    return (
      <Paginator loadPage={loadCardsPage}>
        {cards.map((card) => (
          <Card card={card} key={card.id} />
        ))}
      </Paginator>
    );
  }
};

export default Cards;
