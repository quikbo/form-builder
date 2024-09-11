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
import useMutationDecks from "@/hooks/use-mutation-decks";

const AddDeckDialog = () => {
  const [addFormData, setAddFormData] = useState("");
  const { addNewDeck } = useMutationDecks();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newTitle = addFormData;
    addNewDeck(newTitle);
    setAddFormData("");
  };

  return (
    <div className="flex">
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <DialogHeader>
            <div>
              <DialogTitle>Add Deck</DialogTitle>
              <DialogDescription>
                Enter the title of your deck here.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="flex flex-row items-center pt-5">
            <Label htmlFor="edit" className="font-bold p-5">
              Title
            </Label>
            <Input
              id="edit"
              placeholder="Enter deck title ..."
              defaultValue={addFormData}
              onChange={(e) => setAddFormData(e.target.value)}
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

export default AddDeckDialog;
