import {
  addField,
  decrementFieldCount,
  incrementFieldCount,
  removeField,
  updateFieldContent,
} from "@/lib/store";
import { createField, deleteField, updateField } from "@/data/api";
import { useToast } from "@/components/ui/use-toast";
import useAuth from "./use-auth";

const useMutationFields = (formId: string) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const deleteFieldById = async (fieldId: string) => {
    try {
      await deleteField(formId, fieldId);
      removeField(fieldId);
      decrementFieldCount();
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error deleting the field 🙁",
        description: errorMessage,
      });
    }
  };

  const updateFieldContentById = async (
    fieldId: string,
    front: string,
    back: string,
  ) => {
    try {
      if (!front && !back) {
        throw new Error("Front and back cannot be empty!");
      }
      await updateField(formId, fieldId, front, back);
      updateFieldContent(fieldId, front, back);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sorry! There was an error updating the field 🙁",
        description: (error as Error).message as string,
      });
    }
  };

  const addNewField = async (front: string, back: string) => {
    try {
      if (!front || !back) {
        throw new Error("Front and back cannot be empty!");
      }
      const field = await createField(formId, front, back);
      const fieldWithAuthor = {
        id: field.id,
        front: field.front,
        back: field.back,
        date: field.date,
        formId: field.formId,
        author: {
          id: user.id,
          name: user.name,
          username: user.username,
        },
      };
      addField(fieldWithAuthor);
      incrementFieldCount();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sorry! There was an error adding a new field 🙁",
        description: (error as Error).message as string,
      });
    }
  };

  return {
    deleteFieldById: deleteFieldById,
    updateFieldContentById: updateFieldContentById,
    addNewField: addNewField,
  };
};

export default useMutationFields;
