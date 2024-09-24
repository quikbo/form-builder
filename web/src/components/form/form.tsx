import { FormType } from "@/data/types";
import FormActions from "./form-actions";
import { openPage } from "@nanostores/router";
import { $router } from "@/lib/router";
import { setPage } from "@/lib/store";
import Author from "../shared/author";
import useAuth from "@/hooks/use-auth";

type FormProps = {
  form: FormType;
};

const Form = ({ form }: FormProps) => {
  const { validate } = useAuth();

  const navigateToCardsView = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    await validate();
    setPage(1);
    openPage($router, "form", { formId: form.id });
  };

  // Prevent click events from propagating to the parent div
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flex-none p-4 border-b">
      <div
        className="mx-auto rounded-lg shadow-md p-4 
        border border-gray-200 bg-white hover:shadow-lg transition duration-150 ease-in-out cursor-pointer"
        onClick={navigateToCardsView} // Navigate when clicking the entire card
      >
        <div className="flex justify-between">
          {/* Form Content */}
          <div>
            <div className="text-lg font-semibold mb-1">{form.title}</div>
            <div className="text-sm text-gray-500 mb-2">
              {form.numberOfFields} Fields
            </div>
            <div className="text-xs text-gray-400 mb-2">
              {new Date(form.date).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </div>
            <Author author={form.userId} />
          </div>

          {/* Actions */}
          <div onClick={stopPropagation}>
            <FormActions form={form} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
