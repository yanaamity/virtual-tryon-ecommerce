'use client';

import { useRef, useState, useCallback } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';
import { validateImageSize, validateImageType } from '@/utils/imageComposition';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/utils/constants';

interface PhotoUploadProps {
  onPhotoSelected: (file: File, preview: string) => void;
  isLoading?: boolean;
}

export default function PhotoUpload({ onPhotoSelected, isLoading = false }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (file: File) => {
      setError(null);
      setSuccess(false);

      // Validate file type
      const typeValidation = validateImageType(file);
      if (!typeValidation.valid) {
        setError(typeValidation.error || ERROR_MESSAGES.INVALID_FILE_TYPE);
        return;
      }

      // Validate file size
      const sizeValidation = validateImageSize(file);
      if (!sizeValidation.valid) {
        setError(sizeValidation.error || ERROR_MESSAGES.FILE_TOO_LARGE);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewUrl = e.target?.result as string;
        setPreview(previewUrl);
        setSuccess(true);
        onPhotoSelected(file, previewUrl);
      };
      reader.readAsDataURL(file);
    },
    [onPhotoSelected]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleReset = () => {
    setPreview(null);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          preview
            ? 'border-emerald-400 bg-emerald-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleInputChange}
          className="hidden"
          disabled={isLoading}
        />

        {!preview ? (
          <div className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Your Photo
            </h3>
            <p className="text-gray-600 mb-2">
              Drag and drop your photo here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: JPEG, PNG, WebP (Max 10MB)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative w-full max-w-xs mx-auto">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto rounded-lg shadow-md"
              />
              {success && (
                <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-2">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <button
              onClick={handleReset}
              className="btn btn-ghost flex items-center justify-center gap-2 mx-auto"
              disabled={isLoading}
            >
              <X size={18} /> Upload Different Photo
            </button>
            {success && (
              <p className="text-emerald-600 font-medium">
                {SUCCESS_MESSAGES.UPLOAD_SUCCESS}
              </p>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="spinner"></div>
          <span className="ml-2 text-gray-600">Uploading...</span>
        </div>
      )}
    </div>
  );
}
