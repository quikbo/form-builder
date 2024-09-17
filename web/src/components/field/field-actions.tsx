import { FieldType } from "@/data/types";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import EditDeleteFieldDialog from "./edit-delete-field-dialogs";
import { useState } from "react";
import useAuth from "@/hooks/use-auth";

type FieldActionsProps = {
  field: FieldType;
};

const FieldActions = ({ field }: FieldActionsProps) => {
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
              <DropdownMenuItem>Edit Field</DropdownMenuItem>
            </DialogTrigger>
            <DialogTrigger asChild onClick={() => setDialogType("Delete")}>
              <DropdownMenuItem className="text-red-600">
                Delete Field
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <EditDeleteFieldDialog field={field} dialogType={dialogType} />
      </Dialog>
    </div>
  );
};

export default FieldActions;
