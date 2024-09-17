import {
  addForm,
  decrementFormCount,
  incrementFormCount,
  removeForm,
  updateFormTitle,
} from "@/lib/store";
import { createForm, deleteForm, updateForm } from "@/data/api";
import { useToast } from "@/components/ui/use-toast";
import useAuth from "./use-auth";

const useMutationForms = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const deleteFormById = async (id: string) => {
    try {
      await deleteForm(id);
      removeForm(id);
      decrementFormCount();
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error deleting the form 🙁",
        description: errorMessage,
      });
    }
  };

  const updateFormTitleById = async (id: string, title: string) => {
    try {
      if (!title) {
        throw new Error("Title cannot be empty!");
      }
      await updateForm(id, title);
      updateFormTitle(id, title);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sorry! There was an error updating the form 🙁",
        description: (error as Error).message as string,
      });
    }
  };

  const addNewForm = async (title: string) => {
    try {
      if (!title) {
        throw new Error("Title cannot be empty!");
      }
      const form = await createForm(title, 0);
      const formWithAuthor = {
        id: form.id,
        title: form.title,
        numberOfFields: form.numberOfFields,
        date: form.date,
        userId: {
          id: user.id,
          name: user.name,
          username: user.username,
        },
      };
      addForm(formWithAuthor);
      incrementFormCount();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sorry! There was an error adding a new form 🙁",
        description: (error as Error).message as string,
      });
    }
  };

  return {
    deleteFormById: deleteFormById,
    updateFormTitleById: updateFormTitleById,
    addNewForm: addNewForm,
  };
};

export default useMutationForms;
