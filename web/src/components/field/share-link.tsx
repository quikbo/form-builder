import { useEffect } from 'react';
import useShareLink from '@/hooks/use-shareLink';
import { toast } from '@/components/ui/use-toast';

type ShareLinkProps = {
  formId: string;
};

const ShareLink = ({ formId }: ShareLinkProps) => {
  const { generateShareLink, checkExistingLink, shareLink, loading } = useShareLink();

  // Check for existing share link on component mount
  useEffect(() => {
    const fetchExistingLink = async () => {
      await checkExistingLink(formId);
    };
    fetchExistingLink();
  }, [formId]);

  const handleGenerateLink = async () => {
    await generateShareLink(formId);
  };

  const handleCopyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      toast({
        variant: "default",
        title: "Link copied to clipboard!",
        description: shareLink,
      });
    }
  };

  return (
    <div className="mt-4">
      {loading ? (
        <p>Loading...</p>
      ) : shareLink ? (
        <div>
          <p>Shareable Link:</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="border p-1 w-full rounded"
            />
            <button
              onClick={handleCopyToClipboard}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Copy
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleGenerateLink}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Generate Share Link
        </button>
      )}
    </div>
  );
};

export default ShareLink;
