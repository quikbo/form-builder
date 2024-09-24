import { useEffect, useState } from 'react';
import useQueryFields from '@/hooks/use-query-fields';
import { toast } from '@/components/ui/use-toast';
import Field from '@/components/field/field'; // Adjust path as needed

type SharedFieldsProps = {
  formId: string;
};

const SharedFields = ({ formId }: SharedFieldsProps) => {
  const [fieldsLoading, setFieldsLoading] = useState(true);

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

  // Display loading state while fetching fields
  if (fieldsLoading) {
    return <div>Loading fields...</div>;
  }

  // Display message if no fields are found
  if (fields.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p>
          This form has no fields to display. Create one with the red plus
          button.
        </p>
      </div>
    );
  }

  // Display the fields
  return (
    <div>
      {fields.map((field) => (
        <Field field={field} key={field.id} />
      ))}
    </div>
  );
};

export default SharedFields;
