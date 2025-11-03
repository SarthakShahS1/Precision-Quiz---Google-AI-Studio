/**
 * @file FileUpload.tsx
 * @description A component that provides a drag-and-drop interface for file uploads.
 * It handles file selection, validation, and triggers the processing callback.
 */

import React, { useState, useCallback } from 'react';
import { UploadIcon } from '../constants';

interface FileUploadProps {
  onFileProcess: (file: File) => void;
  disabled: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcess, disabled }) => {
  // State to track if a file is being dragged over the dropzone
  const [isDragging, setIsDragging] = useState<boolean>(false);

  /**
   * Handles file selection from either the file input or drag-and-drop.
   * Validates the file type before processing.
   * @param files A FileList object.
   */
  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      if (allowedTypes.includes(file.type)) {
        onFileProcess(file);
      } else {
        alert('Please select a PDF, DOCX, or TXT file.');
      }
    }
  };

  // Drag-and-drop event handlers
  const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!disabled) {
        handleFileChange(e.dataTransfer.files);
    }
  }, [disabled]);


  return (
    <div className="mb-8">
      <div 
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl transition-all duration-300 group ${
            isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-4 ring-blue-500/20' 
            : 'border-gray-300 dark:border-gray-600'
          } ${
            disabled 
            ? 'cursor-not-allowed bg-gray-200 dark:bg-gray-800 opacity-60' 
            : 'cursor-pointer bg-white/50 dark:bg-gray-800/50 hover:border-blue-400 dark:hover:border-blue-500'
          }`}
      >
        <UploadIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4 transition-transform duration-300 group-hover:scale-110" />
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Drop your document here or <span className="text-blue-500">click to browse</span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Supports: PDF, DOCX, TXT
        </p>
        <input
          type="file"
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          accept=".pdf,.docx,.txt"
          onChange={(e) => handleFileChange(e.target.files)}
          disabled={disabled}
          aria-label="File upload input"
        />
      </div>
    </div>
  );
};

export default FileUpload;