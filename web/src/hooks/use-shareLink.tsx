import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import {
  createShareLink,
  fetchFormByShareLink,
  deleteShareLink,
  checkExistingShareLink, // Import the new API function
} from '@/data/api';

function useShareLink() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);

  // Function to create a share link for a form
  const generateShareLink = async (formId: string) => {
    try {
      setLoading(true);
      const { shareId } = await createShareLink(formId);
      const link = `${window.location.origin}/share/${shareId}`;
      setShareLink(link); // Update the state with the new share link
      toast({
        variant: 'default',
        title: 'Share link generated successfully!',
        description: link,
      });
      return shareId;
    } catch (err) {
      const errorMessage = (err as Error).message ?? 'Unable to generate share link!';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error generating share link',
        description: errorMessage,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to check if a share link already exists for a form
  const checkExistingLink = async (formId: string) => {
    try {
      setLoading(true);
      const existingLink = await checkExistingShareLink(formId);
      if (existingLink) {
        const link = `${window.location.origin}/share/${existingLink.shareId}`;
        setShareLink(link);
      }
      return existingLink;
    } catch (err) {
      const errorMessage = (err as Error).message ?? 'Unable to check for existing share link!';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error checking share link',
        description: errorMessage,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch form data using a share link
  const getFormByShareLink = async (shareId: string) => {
    try {
      setLoading(true);
      const form = await fetchFormByShareLink(shareId);
      return form;
    } catch (err) {
      const errorMessage = (err as Error).message ?? 'Unable to fetch form data!';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error fetching form data',
        description: errorMessage,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a share link
  const removeShareLinkById = async (shareId: string) => {
    try {
      setLoading(true);
      const success = await deleteShareLink(shareId);
      if (success) {
        setShareLink(null); // Clear the share link from state
        toast({
          variant: 'default',
          title: 'Share link deleted successfully!',
        });
      }
      return success;
    } catch (err) {
      const errorMessage = (err as Error).message ?? 'Unable to delete share link!';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error deleting share link',
        description: errorMessage,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateShareLink,
    checkExistingLink, // Export the new function
    getFormByShareLink,
    removeShareLinkById,
    loading,
    error,
    shareLink, // Expose the shareLink state
  };
}

export default useShareLink;
