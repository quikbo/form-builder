import Header from "./header";
import Decks from "../deck/decks";
import Cards from "../card/cards";
import { useStore } from "@nanostores/react";
import { $router } from "@/lib/router";

const Feed = () => {
  const page = useStore($router);

  if (!page) return null; //handle case when user navigates to
  //non existing page

  if (page.route === "home") {
    return (
      <div className="flex flex-col w-full min-h-screen border-x">
        <Header />
        <Decks />
      </div>
    );
  } else if (page.route === "deck") {
    return (
      <div className="flex flex-col w-full min-h-screen border-x">
        <Header />
        <Cards deckId={page.params.deckId} />
      </div>
    );
  }
};

export default Feed;
