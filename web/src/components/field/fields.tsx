import { useEffect } from "react";
import Paginator from "../shared/pagination";
import Field from "./field";
import useQueryFields from "@/hooks/use-query-fields";
import { $currentPage, $totalFieldCount } from "@/lib/store";
import { useStore } from "@nanostores/react";

const Fields = ({ formId }: { formId: string }) => {
  const { fields, loadFields } = useQueryFields(formId);
  const totalFieldCount = useStore($totalFieldCount);
  const curPage = useStore($currentPage);

  useEffect(() => {
    loadFields(curPage);
  }, [totalFieldCount]);

  const loadFieldsPage = (pageIndex: number) => {
    loadFields(pageIndex);
  };

  if (fields.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p>
          This form has no fields to display. Create one with the red plus
          button.
        </p>
      </div>
    );
  } else {
    return (
      <>
      <Paginator loadPage={loadFieldsPage}>
        {fields.map((field) => (
          <Field field={field} key={field.id} />
        ))}
      </Paginator>
      </>
    );
  }
};

export default Fields;
