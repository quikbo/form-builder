import { FieldType } from "@/data/types";
import {
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import useMutationFields from "@/hooks/use-mutation-fields";

type EditFieldDialogProps = {
  field: FieldType;
  dialogType: string;
};

const EditDeleteFieldDialog = ({ field, dialogType }: EditFieldDialogProps) => {
  const [editFrontText, setEditFrontText] = useState(field.front);
  const [editBackText, setEditBackText] = useState(field.back);
  const { updateFieldContentById, deleteFieldById } = useMutationFields(
    field.formId,
  );

  useEffect(() => {
    if (field) {
      field.front !== editFrontText && setEditFrontText(field.front);
      field.back !== editBackText && setEditFrontText(field.back);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateFieldContentById(field.id, editFrontText, editBackText);
  };

  if (dialogType === "Edit") {
    return (
      <div className="flex">
        <DialogContent>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <DialogHeader>
              <div>
                <DialogTitle>Edit Field</DialogTitle>
                <DialogDescription>
                  Edit the front and back of your field here.
                </DialogDescription>
              </div>
            </DialogHeader>
            <div className="flex flex-row items-center pt-5">
              <Label htmlFor="edit" className="font-bold p-5">
                Front
              </Label>
              <Input
                id="edit"
                placeholder="Enter card front ..."
                value={editFrontText}
                onChange={(e) => setEditFrontText(e.target.value)}
              ></Input>
            </div>
            <div className="flex flex-row items-center pt-5">
              <Label htmlFor="edit" className="font-bold p-5">
                Back
              </Label>
              <Input
                id="edit"
                placeholder="Enter card back ..."
                value={editBackText}
                onChange={(e) => setEditBackText(e.target.value)}
              ></Input>
            </div>
            <DialogFooter>
              <div className="flex justify-end pt-5">
                <DialogClose asChild>
                  <Button variant="secondary" type="reset" className="mr-4">
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="default" type="submit">
                    Submit
                  </Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </div>
    );
  }
  if (dialogType === "Delete") {
    return (
      <div className="flex">
        <DialogContent>
          <DialogHeader>
            <div>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                field and remove it from the server.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="flex flex-row items-center pt-5"></div>
          <DialogFooter>
            <div className="flex justify-end pt-5">
              <DialogClose asChild>
                <Button variant="secondary" type="reset" className="mr-4">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="default"
                  onClick={() => deleteFieldById(field.id)}
                >
                  Continue
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </div>
    );
  }
};

export default EditDeleteFieldDialog;
