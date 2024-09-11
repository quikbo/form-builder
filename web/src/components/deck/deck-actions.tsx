import { DeckType } from "@/data/types";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import EditDeleteDeckDialog from "./edit-delete-deck-dialogs";
import useAuth from "@/hooks/use-auth";

type DeckActionsProps = {
  deck: DeckType;
};

const DeckActions = ({ deck }: DeckActionsProps) => {
  const [dialogType, setDialogType] = useState("Edit");
  const { validate } = useAuth();

  return (
    <div className="flex">
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex justify-center items-center h-9 w-9 hover:bg-accent hover:text-accent-foreground"
            onClick={async () => {
              await validate();
            }}
          >
            <DotsVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DialogTrigger
              asChild
              onClick={async () => {
                await validate();
                setDialogType("Edit");
              }}
            >
              <DropdownMenuItem>Edit Deck</DropdownMenuItem>
            </DialogTrigger>

            <DialogTrigger
              asChild
              onClick={async () => {
                await validate();
                setDialogType("Delete");
              }}
            >
              <DropdownMenuItem className="text-red-600">
                Delete Deck
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <EditDeleteDeckDialog deck={deck} dialogType={dialogType} />
      </Dialog>
    </div>
  );
};

export default DeckActions;
