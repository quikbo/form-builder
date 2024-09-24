import { useEffect, useState } from 'react';
import useQueryFields from '@/hooks/use-query-fields';
import { toast } from '@/components/ui/use-toast';
import { FieldType } from '@/data/types'; // Import FieldType for field props
import SharedField from './sharedField';

type SharedFieldsProps = {
  formId: string;
  onResponseChange: (responses: Record<string, any>) => void; // Callback to send responses to parent component
};

const SharedFields = ({ formId, onResponseChange }: SharedFieldsProps) => {
  const [fieldsLoading, setFieldsLoading] = useState(true);
  const [responses, setResponses] = useState<Record<string, any>>({}); // State to track responses

  // Initialize the useQueryFields hook
  const { fields, loadFields } = useQueryFields(formId);

  // Fetch fields when the component mounts or formId changes
  useEffect(() => {
    const fetchFields = async () => {
      try {
        await loadFields(1); // Load the first page of fields
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading fields",
          description: "Unable to load fields. Please try again later!",
        });
      } finally {
        setFieldsLoading(false);
      }
    };

    fetchFields();
  }, [formId]);

  // Function to handle input change for fields
  const handleInputChange = (fieldId: string, value: any) => {
    setResponses((prevResponses) => {
      const updatedResponses = { ...prevResponses, [fieldId]: value }; // Update responses state
      onResponseChange(updatedResponses); // Pass updated responses to parent
      return updatedResponses; // Return updated state
    });
  };

  // Display loading state while fetching fields
  if (fieldsLoading) {
    return <div>Loading fields...</div>;
  }

  // Display message if no fields are found
  if (fields.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p>
          This form has no fields to display.
        </p>
      </div>
    );
  }

  // Display the fields and capture responses
  return (
    <div>
      {fields.map((field: FieldType) => (
         <SharedField
         field={field}
         key={field.id}
         onChange={handleInputChange} // Pass input change handler to SharedField component
         currentResponse={responses[field.id]}
       />
      ))}
    </div>
  );
};

export default SharedFields;
