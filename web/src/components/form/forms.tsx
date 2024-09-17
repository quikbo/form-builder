import { $currentPage, $totalFormCount } from "@/lib/store";
import Paginator from "../shared/pagination";
import Form from "./form";
import useQueryForms from "@/hooks/use-query-forms";
import { useEffect } from "react";
import { useStore } from "@nanostores/react";

const Forms = () => {
  const { forms, loadForms } = useQueryForms();
  const totalFormCount = useStore($totalFormCount);
  const curPage = useStore($currentPage);

  useEffect(() => {
    loadForms(curPage);
  }, [totalFormCount]);

  const loadFormsPage = (pageIndex: number) => {
    loadForms(pageIndex);
  };

  if (forms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        There are no forms to display. Create one with the black plus button.
      </div>
    );
  } else {
    return (
      <Paginator loadPage={loadFormsPage}>
        {forms.map((form) => (
          <Form key={form.id} form={form} />
        ))}
      </Paginator>
    );
  }
};

export default Forms;
