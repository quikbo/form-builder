import { CardType } from "@/data/types";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import EditDeleteCardDialog from "./edit-delete-card-dialogs";
import { useState } from "react";
import useAuth from "@/hooks/use-auth";

type CardActionsProps = {
  card: CardType;
};

const CardActions = ({ card }: CardActionsProps) => {
  const [dialogType, setDialogType] = useState("Edit");
  const { validate } = useAuth();

  return (
    <div className="flex">
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger
            onClick={async () => {
              await validate();
            }}
          >
            <DotsVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DialogTrigger asChild onClick={() => setDialogType("Edit")}>
              <DropdownMenuItem>Edit Card</DropdownMenuItem>
            </DialogTrigger>
            <DialogTrigger asChild onClick={() => setDialogType("Delete")}>
              <DropdownMenuItem className="text-red-600">
                Delete Card
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <EditDeleteCardDialog card={card} dialogType={dialogType} />
      </Dialog>
    </div>
  );
};

export default CardActions;
