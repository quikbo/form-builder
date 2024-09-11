import { DeckType } from "@/data/types";
import DeckActions from "./deck-actions";
import { openPage } from "@nanostores/router";
import { $router } from "@/lib/router";
import { setPage } from "@/lib/store";
import Author from "../shared/author";
import useAuth from "@/hooks/use-auth";

type DeckProps = {
  deck: DeckType;
};

//REFACTOR TO BEING ABLE TO JUST CLICK DECK TO OPEN IT RATHER THAN USING BUTTON
const Deck = ({ deck }: DeckProps) => {
  const { validate } = useAuth();

  const navigateToCardsView = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    await validate();
    setPage(1);
    openPage($router, "deck", { deckId: deck.id });
  };

  return (
    <div className="flex-none p-12 border-b">
      <div
        className="mx-auto rounded shadow-xl p-5 
        border-b-8 border-r-8 border-gray-110  border-double"
      >
        <div className="flex justify-between p1-4">
          <div className="py-4 cursor-pointer" onClick={navigateToCardsView}>
            <div className="text-xl font-bold">{deck.title}</div>
            <div className="text-s text-gray-600">
              {deck.numberOfCards} Cards
            </div>
            <div className="h-40"></div>
            <div>
              <h4 className="text-s text-gray-600">
                {new Date(deck.date).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </h4>
              <Author author={deck.author} />
            </div>
          </div>
          <div className="top-0 right-0">
            <DeckActions deck={deck} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deck;
