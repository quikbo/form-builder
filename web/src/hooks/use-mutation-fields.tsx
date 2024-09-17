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
  // Update field content by ID (including label, required, type, and options)
  const updateFieldContentById = async (
    fieldId: string,
    label: string,
    type: "text" | "multiple_choice" | "checkbox" | "dropdown",
    required: boolean,
    options?: string[],
  ) => {
    try {
      if (!label) {
        throw new Error("Label cannot be empty!");
      }

      let fieldOptions = undefined;
      if (options && options.length >= 0) {
        fieldOptions = options;
      }

      // Call the API to update the field with new properties
      await updateField(
        formId,
        fieldId,
        label,
        type,
        required,
        fieldOptions, // Send options only if available
      );

      // Update the field in the store
      updateFieldContent(fieldId, {
        label,
        type,
        required,
        options: options?.length ? options : undefined,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sorry! There was an error updating the field 🙁",
        description: (error as Error).message as string,
      });
    }
  };

  // Add a new field (with new properties)
  const addNewField = async (
    label: string,
    type: "text" | "multiple_choice" | "checkbox" | "dropdown",
    required: boolean,
    options?: string[],
  ) => {
    try {
      if (!label) {
        throw new Error("Label cannot be empty!");
      }

      let fieldOptions = undefined;
      if (options && options.length >= 0) {
        fieldOptions = options;
      }

      // Call the API to create the new field
      const field = await createField(
        formId,
        label,
        type,
        required,
        fieldOptions,
      );

      // Add the new field with author details
      const fieldWithAuthor = {
        id: field.id,
        label: field.label,
        type: field.type,
        required: field.required,
        options: field.options,
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
