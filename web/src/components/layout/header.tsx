import { $router } from "@/lib/router";
import {
  $fields,
  $currentPage,
  $forms,
  $pageLimit,
  $totalFieldCount,
  $totalFormCount,
} from "@/lib/store";
import { useStore } from "@nanostores/react";

const Header = () => {
  const page = useStore($router);
  if (!page) return null;

  const curPage = useStore($currentPage);
  const limit = useStore($pageLimit);
  const fields = useStore($fields);
  const forms = useStore($forms);
  let totalItems = 0;

  if (page.route === "home") {
    totalItems = useStore($totalFormCount);
  } else {
    totalItems = useStore($totalFieldCount);
  }

  const displayHomePagination = () => {
    if (totalItems === 0) {
      return <>0 forms</>;
    }
    return (
      <div>
        {limit * (curPage - 1) + 1} - {limit * curPage - (limit - forms.length)}{" "}
        of {forms.length} forms
      </div>
    );
  };

  const displayFormPagination = () => {
    if (totalItems === 0) {
      return <>0 fields</>;
    }
    return (
      <div className="text-red-600">
        {limit * (curPage - 1) + 1} -{" "}
        {limit * curPage - (limit - fields.length)} of {fields.length} fields
      </div>
    );
  };

  return (
    <div className="flex justify-end items-right gap-3 p-3 border-b">
      {page.route === "home" && displayHomePagination()}
      {page.route === "form" && displayFormPagination()}
    </div>
  );
};

export default Header;
