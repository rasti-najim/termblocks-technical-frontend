"use client";

import { ShareIcon } from "@heroicons/react/24/outline";

interface ClientShareButtonProps {
  id: string;
}

export default function ClientShareButton({ id }: ClientShareButtonProps) {
  const handleShare = () => {
    // In a real app, this would open a share dialog or implement sharing functionality
    console.log("Share checklist:", id);
    alert(`Sharing checklist ${id} (Not implemented in this demo)`);
  };

  return (
    <button
      onClick={handleShare}
      className="action-button text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
    >
      <ShareIcon className="w-5 h-5" />
    </button>
  );
}
