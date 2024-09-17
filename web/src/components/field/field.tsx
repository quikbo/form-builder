import { FieldType } from "@/data/types";
import FieldActions from "./field-actions";
//import Author from "../shared/author";
//import useAuth from "@/hooks/use-auth";

type FieldProps = {
  field: FieldType;
};

const Field = ({ field }: FieldProps) => {
  //const { user } = useAuth();

  const renderField = () => {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            placeholder="Enter response..."
            className="w-full p-2 border rounded"
          />
        );
      case "multiple_choice":
        return (
          <div>
            {field.options?.map((option, index) => (
              <div key={index}>
                <input type="radio" id={option} name={field.id} />
                <label htmlFor={option}>{option}</label>
              </div>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div>
            {field.options?.map((option, index) => (
              <div key={index}>
                <input type="checkbox" id={option} name={field.id} />
                <label htmlFor={option}>{option}</label>
              </div>
            ))}
          </div>
        );
      case "dropdown":
        return (
          <select className="w-full p-2 border rounded">
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex-none p-12 border-b relative">
        {/*  <Author author={user} /> */}
        <div className="mx-auto rounded-lg p-5 border-black border-2 border-solid">
          <label className="block mb-2">{field.label}</label>
          {renderField()}
        </div>
        <div className="absolute top-14 right-5">
          <FieldActions field={field} />
        </div>
      </div>
    </>
  );
};

export default Field;
