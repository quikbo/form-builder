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
  const [label, setLabel] = useState("");
  const [required, setRequired] = useState(false);
  const [type, setType] = useState<"text" | "multiple_choice" | "checkbox" | "dropdown">("text");
  const [options, setOptions] = useState("");

  const { addNewField } = useMutationFields(formId);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formattedOptions = 
      type === "multiple_choice" || type === "checkbox" || type === "dropdown"
        ? options.split(",").map((option) => option.trim())
        : undefined;

    await addNewField(label, type, required, formattedOptions);
    
    // Clear the form fields after submission
    setLabel("");
    setRequired(false);
    setType("text");
    setOptions("");
  };

  return (
    <div className="flex">
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <DialogHeader>
            <div>
              <DialogTitle>Add Field</DialogTitle>
              <DialogDescription>
                Add a new field to your form with the desired attributes.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="flex flex-row items-center pt-5">
            <Label htmlFor="label" className="font-bold p-5">
              Label
            </Label>
            <Input
              id="label"
              placeholder="Enter question label..."
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          <div className="flex flex-row items-center pt-5">
            <Label htmlFor="required" className="font-bold p-5">
              Required
            </Label>
            <Input
              id="required"
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
            />
          </div>

          <div className="flex flex-row items-center pt-5">
            <Label htmlFor="type" className="font-bold p-5">
              Type
            </Label>
            <select
              id="type"
              value={type}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setType(
                  e.target.value as
                    | "text"
                    | "multiple_choice"
                    | "checkbox"
                    | "dropdown"
                )
              }
              className="form-select"
            >
              <option value="text">Text</option>
              <option value="multiple_choice">Multiple Choice</option>
              <option value="checkbox">Checkbox</option>
              <option value="dropdown">Dropdown</option>
            </select>
          </div>

          {/* Show options input only for specific field types */}
          {(type === "multiple_choice" ||
            type === "checkbox" ||
            type === "dropdown") && (
            <div className="flex flex-row items-center pt-5">
              <Label htmlFor="options" className="font-bold p-5">
                Options (comma-separated)
              </Label>
              <Input
                id="options"
                placeholder="Enter options, separated by commas..."
                value={options}
                onChange={(e) => setOptions(e.target.value)}
              />
            </div>
          )}

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
