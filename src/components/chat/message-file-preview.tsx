"use client";

import React, { useEffect, useState } from "react";
import { X, FileText, File } from "lucide-react";

interface MessageFilePreviewProps {
  file?: File;
  fileUrl?: string;
  onRemove: () => void;
}

const MessageFilePreview: React.FC<MessageFilePreviewProps> = ({ file, fileUrl, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      }
    } else if (fileUrl) {
      const extension = fileUrl.split('.').pop()?.toLowerCase();
      if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) {
        setPreviewUrl(fileUrl);
      }
    }
    setPreviewUrl(null);
  }, [file, fileUrl]);

  const getFileIcon = () => {
    const name = file ? file.name : fileUrl?.split('/').pop() || '';
    const extension = name.split('.').pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) {
      return previewUrl ? (
        <img
          src={previewUrl}
          alt="File preview"
          className="w-6 h-6 object-cover rounded"
        />
      ) : (
        <File size={20} className="text-gray-500" />
      );
    }
    if (extension === "pdf") {
      return <FileText size={20} className="text-blue-500" />;
    }
    return <File size={20} className="text-gray-500" />;
  };

  const displayName = file ? file.name : fileUrl?.split('/').pop() || 'Unknown File';

  return (
    <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md shadow-sm border border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center gap-2">
        {getFileIcon()}
        <span className="text-sm text-zinc-700 dark:text-zinc-200 truncate max-w-[120px]">
          {displayName}
        </span>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="h-[20px] w-[20px] bg-white dark:bg-zinc-700 rounded-full p-1 flex items-center justify-center shadow hover:bg-gray-100 dark:hover:bg-zinc-600 transition"
      >
        <X size={14} className="text-red-500" />
      </button>
    </div>
  );
};

export default MessageFilePreview;