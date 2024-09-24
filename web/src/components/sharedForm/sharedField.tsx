import { FieldType } from "@/data/types";

type SharedFieldProps = {
  field: FieldType;
  currentResponse?: string[]; // Optional current response for checkboxes
  onChange: (fieldId: string, value: any) => void; // Handle response change
};


const SharedField = ({ field, onChange, currentResponse }: SharedFieldProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (field.type === "checkbox") {
      const target = event.target as HTMLInputElement;
      const currentResponses = target.checked ? [target.value] : [];
      onChange(field.id, currentResponses);
    } else {
      onChange(field.id, event.target.value);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = target.value;
    const isChecked = target.checked;
  
    // Get the existing responses for the current field, or an empty array if none exist
    const currentResponses: string[] = Array.isArray(currentResponse) ? currentResponse : [];
    let updatedResponses;
    if (isChecked) {
      // Add the checkbox value to the response array
      updatedResponses = [...currentResponses, value];
    } else {
      // Remove the checkbox value from the response array
      updatedResponses = currentResponses.filter((response) => response !== value);
    }
  
    // Call onChange with the updated array of selected values
    onChange(field.id, updatedResponses);
  };

  const renderLabel = (label: string, required?: boolean) => (
    <label className="block mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
  );
  

  switch (field.type) {
    case "text":
      return (
        <div className="mb-4">
          <label className="block mb-2">{renderLabel(field.label, field.required)}</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            onChange={handleChange}
          />
        </div>
      );
    case "multiple_choice":
      return (
        <div className="mb-4">
          <label className="block mb-2">{renderLabel(field.label, field.required)}</label>
          {field.options?.map((option, index) => (
            <div key={index}>
              <input
                type="radio"
                id={option}
                name={field.id}
                value={option}
                onChange={handleChange}
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>
      );
    case "checkbox":
      return (
        <div className="mb-4">
          <label className="block mb-2">{renderLabel(field.label, field.required)}</label>
          {field.options?.map((option, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={option}
                name={field.id}
                value={option}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>
      );
    case "dropdown":
      return (
        <div className="mb-4">
          <label className="block mb-2">{renderLabel(field.label, field.required)}</label>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => onChange(field.id, e.target.value)} // Ensure value is passed to onChange
            defaultValue="" // Set default value to an empty string
          >
            <option value="" disabled>
              Select...
            </option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    default:
      return null;
  }
};

export default SharedField;
