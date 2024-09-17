import {
  $forms,
  setForms,
  setPageLimit,
  setTotalFormCount,
  setTotalFormPages,
} from "@/lib/store";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { fetchForms } from "@/data/api";
import { toast } from "@/components/ui/use-toast";

const useQueryForms = () => {
  const forms = useStore($forms);

  const loadForms = async (page: number = 1) => {
    try {
      const {
        data: fetchedForms,
        totalForms,
        totalPages,
        limit,
      } = await fetchForms(page);
      setPageLimit(limit);
      setTotalFormCount(totalForms);
      setTotalFormPages(totalPages);
      setForms([...fetchedForms]);
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? "Please try again later!";
      toast({
        variant: "destructive",
        title: "Sorry! There was an error reading the forms 🙁",
        description: errorMessage,
      });
    } finally {
    }
  };

  useEffect(() => {
    loadForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    forms,
    loadForms: loadForms,
  };
};

export default useQueryForms;
