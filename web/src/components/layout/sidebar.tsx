import {
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import AddDeckDialog from "../deck/add-deck-dialog";
import { $router } from "@/lib/router";
import { openPage } from "@nanostores/router";
import { useStore } from "@nanostores/react";
import AddCardDialog from "../card/add-card-dialog";
import useAuth from "@/hooks/use-auth";

const Sidebar = () => {
  const page = useStore($router);
  const { validate } = useAuth();
  /*
  const { user } = useAuth();
  const authGuard = () => {
    if (user && user.username) return true;

    toast({
      variant: "destructive",
      title: "Sorry! You need to be signed in to do that!",
      description: "Please sign in or create an account to continue",
    })

    return false;
  }
    */

  if (!page) return null;

  const navigateHome = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await validate();
    openPage($router, "home");
  };

  return (
    <div className="flex flex-col items-end p-2 space-y-2">
      <Button
        aria-label={"Home"}
        variant="ghost"
        size="icon"
        onClick={navigateHome}
      >
        <HomeIcon className="w-5 h-5" />
      </Button>
      <Button aria-label={"Search"} variant="ghost" size="icon">
        <MagnifyingGlassIcon className="w-5 h-5" />
      </Button>
      {page.route === "home" && (
        <Dialog>
          <DialogTrigger asChild onClick={async () => await validate()}>
            <Button aria-label={"Make a Deck"} variant="default" size="icon">
              <PlusCircledIcon className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <AddDeckDialog />
        </Dialog>
      )}
      {page.route === "deck" && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              aria-label={"Make a Deck"}
              variant="destructive"
              size="icon"
            >
              <PlusCircledIcon className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <AddCardDialog deckId={page.params.deckId} />
        </Dialog>
      )}
    </div>
  );
};

export default Sidebar;
