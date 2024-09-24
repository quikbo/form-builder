import {
  $responses,
  setResponses,
  setPageLimit,
  setTotalResponseCount,
  setTotalResponsePages,
} from "@/lib/store"; // Update this import based on your store for responses
import { useStore } from "@nanostores/react";
import { useState, useEffect } from "react";
import { fetchResponsesByFormId } from "@/data/api"; // Adjust the import based on your API structure
import { toast } from "@/components/ui/use-toast";

const useQueryResponses = (formId: string) => {
  const responses = useStore($responses); // Your store for responses
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Function to load responses with proper error handling
  const loadResponses = async (page: number = 1) => {
    setIsLoading(true); // Start loading
    try {
      const {
        data: fetchedResponses,
        totalResponses,
        totalPages,
        limit,
      } = await fetchResponsesByFormId(formId, page); // Fetch responses by form ID

      // Update store states with fetched data
      setPageLimit(limit);
      setTotalResponseCount(totalResponses);
      setTotalResponsePages(totalPages);
      setResponses([...fetchedResponses]);
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error reading the responses 🙁",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // Load responses whenever formId changes
  useEffect(() => {
    if (formId) {
      loadResponses(); // Only load responses if formId is not empty
    }
  }, [formId]);

  return {
    responses,
    loadResponses,
    isLoading, // Return loading state
  };
};

export default useQueryResponses;
