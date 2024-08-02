import React, { useState } from "react";

const SharingUrl = ({ url }: { url: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((error) => {
        console.log("Error copying to clipboard: ", error);
      });
  };

  return (
    <div className="mt-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          readOnly
          value={url}
          className="w-full truncate rounded-md border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={copyToClipboard} className="button-secondary">
          {isCopied ? "Copied!" : "Copy"}
        </button>
      </div>
      {isCopied && (
        <p className="mt-1 text-green-500">Link copied to clipboard!</p>
      )}
    </div>
  );
};

export default SharingUrl;
