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
import { useState } from "react";
import useMutationFields from "@/hooks/use-mutation-fields";

const AddFieldDialog = ({ formId }: { formId: string }) => {
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");
  const { addNewField } = useMutationFields(formId);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addNewField(frontText, backText);
    setFrontText("");
  };

  return (
    <div className="flex">
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <DialogHeader>
            <div>
              <DialogTitle>Add Field</DialogTitle>
              <DialogDescription>
                Enter the front and back of your field here.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="flex flex-row items-center pt-5">
            <Label htmlFor="edit" className="font-bold p-5">
              Front
            </Label>
            <Input
              id="edit"
              placeholder="Enter front of field ..."
              defaultValue={frontText}
              onChange={(e) => setFrontText(e.target.value)}
            ></Input>
          </div>
          <div className="flex flex-row items-center pt-5">
            <Label htmlFor="edit" className="font-bold p-5">
              Back
            </Label>
            <Input
              id="edit"
              placeholder="Enter Back of field ..."
              defaultValue={backText}
              onChange={(e) => setBackText(e.target.value)}
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
                  Save
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </div>
  );
};

export default AddFieldDialog;
