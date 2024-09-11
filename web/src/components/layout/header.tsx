import { $router } from "@/lib/router";
import {
  $cards,
  $currentPage,
  $decks,
  $pageLimit,
  $totalCardCount,
  $totalDeckCount,
} from "@/lib/store";
import { useStore } from "@nanostores/react";

const Header = () => {
  const page = useStore($router);
  if (!page) return null;

  const curPage = useStore($currentPage);
  const limit = useStore($pageLimit);
  const cards = useStore($cards);
  const decks = useStore($decks);
  let totalItems = 0;

  if (page.route === "home") {
    totalItems = useStore($totalDeckCount);
  } else {
    totalItems = useStore($totalCardCount);
  }

  const displayHomePagination = () => {
    if (totalItems === 0) {
      return <>0 decks</>;
    }
    return (
      <div>
        {limit * (curPage - 1) + 1} - {limit * curPage - (limit - decks.length)}{" "}
        of {totalItems} decks
      </div>
    );
  };

  const displayDeckPagination = () => {
    if (totalItems === 0) {
      return <>0 cards</>;
    }
    return (
      <div className="text-red-600">
        {limit * (curPage - 1) + 1} - {limit * curPage - (limit - cards.length)}{" "}
        of {totalItems} cards
      </div>
    );
  };

  return (
    <div className="flex justify-end items-right gap-3 p-3 border-b">
      {page.route === "home" && displayHomePagination()}
      {page.route === "deck" && displayDeckPagination()}
    </div>
  );
};

export default Header;
