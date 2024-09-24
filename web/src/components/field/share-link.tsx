import { useEffect, useState } from 'react';
import useShareLink from '@/hooks/use-shareLink';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '../ui/dialog';
import { Share1Icon } from '@radix-ui/react-icons'; // Import the share icon from Heroicons

type ShareLinkProps = {
  formId: string;
};

const ShareLink = ({ formId }: ShareLinkProps) => {
  const { generateShareLink, checkExistingLink, shareLink, loading } = useShareLink();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      {/* Trigger button to open dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
        <div className="cursor-pointer bg-white border border-gray-300 rounded flex items-center justify-center w-10 h-10 shadow-sm hover:shadow-md transition duration-150">
            <Share1Icon className="w-6 h-6 text-gray-600" />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shareable Link</DialogTitle>
          </DialogHeader>
          {loading ? (
            <p>Loading...</p>
          ) : shareLink ? (
            <div>
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
              className="bg-green-500 text-white px-4 py-2 rounded mt-4"
            >
              Generate Share Link
            </button>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <button className="bg-gray-300 text-black px-4 py-2 rounded">
                Close
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShareLink;
