import { $router } from "@/lib/router";
import {
  $fields,
  $currentPage,
  $forms,
  $pageLimit,
  $totalFieldCount,
  $totalFormCount,
  setPage,
  $totalResponseCount, // Assuming you have a store for total responses count
} from "@/lib/store";
import { useStore } from "@nanostores/react";
import ShareLink from "../field/share-link";
import { openPage } from "@nanostores/router";
import useAuth from "@/hooks/use-auth";

const Header = () => {
  const page = useStore($router);
  if (!page) return null;

  const curPage = useStore($currentPage);
  const limit = useStore($pageLimit);
  const fields = useStore($fields);
  const forms = useStore($forms);
  const totalResponses = useStore($totalResponseCount); 
  const totalFormCount = useStore($totalFormCount);
  const totalFieldCount = useStore($totalFieldCount);
  
  let totalItems = 0;

  const { validate } = useAuth();

  const handleResponsesNavigation = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (page.route === "form") {
      e.preventDefault();
      await validate();
      setPage(1);
      openPage($router, "responses", { formId: page.params.formId }); // Navigate to responses page
    }
  };

  const handleFieldsNavigation = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (page.route === "responses") {
      e.preventDefault();
      await validate();
      setPage(1);
      openPage($router, "form", { formId: page.params.formId }); // Navigate back to fields page
    }
  };

  if (page.route === "home") {
    totalItems = totalFormCount;
  } else if (page.route === "form") {
    totalItems = totalFieldCount;
  } else if (page.route === "responses") {
    totalItems = totalResponses; // Use total responses count for responses page
  }

  const displayHomePagination = () => {
    if (totalItems === 0) {
      return <>0 forms</>;
    }
    return (
      <div className="flex justify-end items-right gap-3 p-3 border-b">
        {limit * (curPage - 1) + 1} - {limit * curPage - (limit - forms.length)}{" "}
        of {forms.length} forms
      </div>
    );
  };

  const displayFormPagination = () => {
    if (totalItems === 0) {
      return <>0 fields</>;
    }
    if (page.route === "form") {
      return (
        <div className="flex justify-between items-center p-3 border-b">
          {/* Container for ShareLink, centered with flex-grow */}
          <div className="flex-grow flex justify-start">
            <ShareLink formId={page.params.formId} />
          </div>

          {/* Container for Responses Button, centered using mx-auto */}
          <div className="mx-auto">
            <button
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
              onClick={handleResponsesNavigation}
            >
              Responses
            </button>
          </div>

          {/* Container for pagination text, aligned to right with flex-grow */}
          <div className="flex-grow flex justify-end text-red-600">
            {limit * (curPage - 1) + 1} - {limit * curPage - (limit - fields.length)} of {fields.length} fields
          </div>
        </div>
      );
    }
  };

  const displayResponsesPagination = () => {
    if (totalItems === 0) {
      return <>0 responses</>;
    }
    if (page.route === "responses") {
      return (
        <div className="flex justify-between items-center p-3 border-b">
          {/* Container for Return to Fields Button, centered with flex-grow */}
          <div className="flex-grow flex justify-start">
            <button
              className="bg-blue-200 text-blue-800 px-4 py-2 rounded"
              onClick={handleFieldsNavigation}
            >
              Return to Fields
            </button>
          </div>

          {/* Container for pagination text, aligned to right with flex-grow */}
          <div className="flex-grow flex justify-end text-red-600">
            {limit * (curPage - 1) + 1} - {limit * curPage - (limit - totalResponses)} of {totalResponses} responses
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      {page.route === "home" && displayHomePagination()}
      {page.route === "form" && displayFormPagination()}
      {page.route === "responses" && displayResponsesPagination()}
    </div>
  );
};

export default Header;
