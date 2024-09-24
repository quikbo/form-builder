import { useEffect, useState } from 'react';
import { fetchFormByShareLink } from "@/data/api"; // Adjust import based on your file structure
import { FormType } from "@/data/types"; // Adjust import based on your file structure
import { toast } from "@/components/ui/use-toast";
import SharedFields from './sharedFields'; // Import the SharedFields component

const SharedFormView = ({ shareId }: { shareId: string }) => {
  const [form, setForm] = useState<FormType | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the form data using the shareId
  useEffect(() => {
    const loadForm = async () => {
      try {
        const formData = await fetchFormByShareLink(shareId);
        setForm(formData);
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

    loadForm();
  }, [shareId]);

  // Display loading state while fetching form data
  if (loading) {
    return <div>Loading form...</div>;
  }

  // Display message if no form found
  if (!form) {
    return <div>No form found.</div>;
  }

  // Higher-level form actions can go here
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
      {/* Render the SharedFields component */}
      <SharedFields formId={form.id} />

      {/* Add higher-level form actions like submit button here */}
      <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">
        Submit Form
      </button>
    </div>
  );
}

export default SharedFormView;
