import { FieldType } from "@/data/types";

type sharedFieldProps = {
  field: FieldType;
  onInputChange: (fieldId: string, value: any) => void; // Function to handle input changes
};

const sharedField = ({ field, onInputChange }: sharedFieldProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onInputChange(field.id, event.target.value); // Call parent handler on input change
  };

  return (
    <div className="mb-4">
      <label className="block mb-1">{field.label}</label>
      {field.type === "text" && (
        <input
          type="text"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      )}
      {field.type === "multiple_choice" && (
        <div>
          {field.options?.map((option, index) => (
            <div key={index}>
              <input
                type="radio"
                id={option}
                name={field.id}
                onChange={() => onInputChange(field.id, option)}
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>
      )}
      {field.type === "checkbox" && (
        <div>
          {field.options?.map((option, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={option}
                name={field.id}
                onChange={(e) => onInputChange(field.id, e.target.checked)}
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>
      )}
      {field.type === "dropdown" && (
        <select onChange={handleChange} className="w-full p-2 border rounded">
          {field.options?.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default sharedField;
