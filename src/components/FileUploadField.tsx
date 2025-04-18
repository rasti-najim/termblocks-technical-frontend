"use client";

import { useState, useRef } from "react";
import {
  PaperClipIcon,
  XMarkIcon,
  DocumentIcon,
  Square2StackIcon,
} from "@heroicons/react/24/outline";

interface FileUploadFieldProps {
  onFilesSelected: (files: File[]) => void;
  existingFiles?: string[];
  error?: string;
  allowMultiple?: boolean;
}

export default function FileUploadField({
  onFilesSelected,
  existingFiles = [],
  error,
  allowMultiple = true,
}: FileUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles: File[]) => {
    let updatedFiles;
    if (!allowMultiple) {
      // If single file mode, only take the last file
      updatedFiles = newFiles.slice(-1);
    } else {
      updatedFiles = [...files, ...newFiles];
    }
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  const removeFile = (fileToRemove: File) => {
    const updatedFiles = files.filter((f) => f !== fileToRemove);
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  return (
    <div className="space-y-2">
      <div
        className={`relative rounded-lg transition-colors duration-200 ${
          isDragging ? "bg-blue-50" : "hover:bg-gray-50"
        } ${error ? "border border-red-300" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 rounded-md hover:bg-blue-50"
            >
              <PaperClipIcon className="w-5 h-5" />
              <span>Attach {allowMultiple ? "files" : "a file"}</span>
            </button>
            <span className="text-gray-400">or drag and drop</span>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200
              ${allowMultiple ? "text-blue-600 bg-blue-50" : "text-gray-500"}`}
          >
            <Square2StackIcon className="w-5 h-5" />
            <span className="text-sm">
              {allowMultiple ? "Multiple files" : "Single file"}
            </span>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple={allowMultiple}
          onChange={handleFileInput}
        />
      </div>

      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}

      {/* File list */}
      {(files.length > 0 || existingFiles.length > 0) && (
        <div className="mt-3 space-y-2">
          {existingFiles.map((fileName, index) => (
            <div
              key={`existing-${index}`}
              className="flex items-center justify-between py-1"
            >
              <div className="flex items-center gap-2">
                <DocumentIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{fileName}</span>
              </div>
              <span className="text-xs text-gray-400">Uploaded</span>
            </div>
          ))}

          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between py-1"
            >
              <div className="flex items-center gap-2">
                <DocumentIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
