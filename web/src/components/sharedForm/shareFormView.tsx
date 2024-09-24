import { useEffect, useState } from "react";
import { fetchFormByShareLink } from "@/data/api"; // Adjust import based on your file structure
import { FormType, FieldType } from "@/data/types"; // Adjust import based on your file structure
import { toast } from "@/components/ui/use-toast";
import SharedFields from "./sharedFields"; // Import the new SharedFields component
import useMutationResponses from "@/hooks/use-mutation-responses"; // Import the useMutationResponses hook
import useQueryFields from "@/hooks/use-query-fields"; // Import the useQueryFields hook

const SharedFormView = ({ shareId }: { shareId: string }) => {
  const [form, setForm] = useState<FormType | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({}); // State for form responses
  const [loading, setLoading] = useState(true);
  const { addNewResponse } = useMutationResponses(); // Hook to handle response submission

  // Using the custom hook to fetch fields
  const { fields, loadFields } = useQueryFields(""); // Initially empty formId

  // Fetch the form data using the shareId
  useEffect(() => {
    const loadFormAndFields = async () => {
      try {
        const formData = await fetchFormByShareLink(shareId);
        setForm(formData); // Set form data

        if (formData.id) {
          await loadFields(Number(formData.id)); // Load fields for the form using formId
        }
      } catch (error) {
        const errorMessage =
          (error as Error).message ?? "Please try again later!";
        toast({
          variant: "destructive",
          title: "Error loading form",
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    loadFormAndFields(); // Load form and fields when the component mounts or shareId changes
  }, [shareId, loadFields]);

  // Handle submit button click
  const handleSubmit = async () => {
    if (!form) return;

    // Check if all required fields are filled
    const requiredFields = fields.filter((field: FieldType) => field.required);
    const missingFields = requiredFields.filter((field) => !responses[field.id]);
    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: `Please fill out all required fields before submitting.`,
      });
      return;
    }

    try {
      // Map responses object to the expected format [{ fieldId, response }]
      const formattedResponses = Object.entries(responses).map(([fieldId, response]) => ({
        fieldId,
        response,
      }));

      await addNewResponse(form.id, formattedResponses);
      toast({
        variant: "default",
        title: "Submission Received!",
        description: "Your response has been submitted successfully.",
      });
      setResponses({}); // Clear the form after successful submission
    } catch (error) {
      const errorMessage = (error as Error).message ?? "Submission failed, please try again.";
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: errorMessage,
      });
    }
  };

  // Display loading state while fetching form data
  if (loading) {
    return <div>Loading form...</div>;
  }

  // Display message if no form found
  if (!form) {
    return <div>No form found.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
      {/* Render the SharedFields component */}
      <SharedFields
        formId={form.id}
        onResponseChange={setResponses} // Pass response handler to SharedFields
      />
      {/* Add submit button here */}
      <button
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
        onClick={handleSubmit}
      >
        Submit Form
      </button>
    </div>
  );
};

export default SharedFormView;
