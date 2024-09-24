import Paginator from "../shared/pagination";
import useQueryResponses from "@/hooks/use-query-responses";
import Response from "./response"; // Import the Response component
import { useEffect } from "react";
import { $currentPage, $totalResponseCount } from "@/lib/store";
import { useStore } from "@nanostores/react";

const Responses = ({ formId }: { formId: string }) => {
  const { responses, loadResponses, isLoading } = useQueryResponses(formId); // Include loading state from hook
  const totalResponseCount = useStore($totalResponseCount);
  const curPage = useStore($currentPage);

  // Fetch responses on component mount and when curPage or formId changes
  useEffect(() => {
    loadResponses(curPage);
  }, [curPage, formId, totalResponseCount]); // Include curPage and formId in dependency array

  // Load the requested page of responses
  const loadResponsesPage = (pageIndex: number) => {
    loadResponses(pageIndex);
  };

  // Ensure all hooks are called unconditionally before returning JSX
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p>Loading responses...</p>
      </div>
    );
  }

  if (!responses || responses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p>No responses to display.</p>
      </div>
    );
  }

  return (
    <>
      <Paginator loadPage={loadResponsesPage}>
        {responses.map((response) => (
          <Response key={response.id} response={response} /> 
        ))}
      </Paginator>
    </>
  );
};

export default Responses;
