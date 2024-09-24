import {
  $fields,
  setFields,
  setPageLimit,
  setTotalFieldCount,
  setTotalFieldPages,
} from "@/lib/store";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { fetchFields } from "@/data/api";
import { toast } from "@/components/ui/use-toast";

const useQueryFields = (formId: string) => {
  const fields = useStore($fields);

  const loadFields = async (page: number = 1) => {
    if (formId === '') {
      return;
    }
    try {
      const {
        data: fetchedCards,
        totalFields: totalCards,
        totalPages,
        limit,
      } = await fetchFields(formId, page);
      setPageLimit(limit);
      setTotalFieldCount(totalCards);
      setTotalFieldPages(totalPages);
      setFields([...fetchedCards]);
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: `Sorry! There was an error reading the cards from form ${formId} 🙁`,
        description: errorMessage,
      });
    }
  };

  useEffect(() => {
    loadFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  return {
    fields,
    loadFields: loadFields,
  };
};

export default useQueryFields;
