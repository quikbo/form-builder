import { FormType } from "@/data/types";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import EditDeleteFormDialog from "./edit-delete-form-dialogs";
import useAuth from "@/hooks/use-auth";

type FormActionsProps = {
  form: FormType;
};

const FormActions = ({ form }: FormActionsProps) => {
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
              <DropdownMenuItem>Edit Form</DropdownMenuItem>
            </DialogTrigger>

            <DialogTrigger
              asChild
              onClick={async () => {
                await validate();
                setDialogType("Delete");
              }}
            >
              <DropdownMenuItem className="text-red-600">
                Delete Form
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <EditDeleteFormDialog form={form} dialogType={dialogType} />
      </Dialog>
    </div>
  );
};

export default FormActions;
