import {
  addResponse,
  updateResponseById,
  removeResponse,
} from "@/lib/store";
import { createResponse, deleteResponse, updateResponseFields } from "@/data/api";
import { useToast } from "@/components/ui/use-toast";

const useMutationResponses = () => {
  const { toast } = useToast();

  // Create a new response
  const addNewResponse = async (formId: string, responseData: any) => {
    try {
      if (!responseData) {
        throw new Error("Response data cannot be empty!");
      }
      const response = await createResponse(formId, responseData);
      addResponse(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sorry! There was an error submitting your response 🙁",
        description: (error as Error).message as string,
      });
    }
  };

  // Update an existing response
  const updateResponse = async (responseId: string, updatedData: any) => {
    try {
      if (!updatedData) {
        throw new Error("Updated data cannot be empty!");
      }
      await updateResponseFields(responseId, updatedData);
      updateResponseById(responseId, updatedData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sorry! There was an error updating your response 🙁",
        description: (error as Error).message as string,
      });
    }
  };

  // Delete a response by ID
  const deleteResponseById = async (responseId: string) => {
    try {
      await deleteResponse(responseId);
      removeResponse(responseId);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sorry! There was an error deleting the response 🙁",
        description: (error as Error).message as string,
      });
    }
  };

  return {
    addNewResponse,
    updateResponse,
    deleteResponseById,
  };
};

export default useMutationResponses;
