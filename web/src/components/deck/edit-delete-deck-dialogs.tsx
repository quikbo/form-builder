import { DeckType } from "@/data/types";
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
import useMutationDecks from "@/hooks/use-mutation-decks";

type EditDeckDialogProps = {
  deck: DeckType;
  dialogType: string;
};

const EditDeleteDeckDialog = ({ deck, dialogType }: EditDeckDialogProps) => {
  const [editFormData, setEditFormData] = useState(deck.title);
  const { updateDeckTitleById, deleteDeckById } = useMutationDecks();

  useEffect(() => {
    if (deck && deck.title !== editFormData) {
      setEditFormData(deck.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newTitle = editFormData;
    updateDeckTitleById(deck.id, newTitle);
  };

  if (dialogType === "Edit") {
    return (
      <div className="flex">
        <DialogContent>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <DialogHeader>
              <div>
                <DialogTitle>Edit Deck</DialogTitle>
                <DialogDescription>
                  Edit the title of your deck here.
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
                value={editFormData}
                onChange={(e) => setEditFormData(e.target.value)}
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
                deck and associated cards from our server.
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
                  onClick={() => deleteDeckById(deck.id)}
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

export default EditDeleteDeckDialog;
