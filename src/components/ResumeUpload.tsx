import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, Check, AlertCircle } from 'lucide-react';

interface ResumeUploadProps {
  onFilesSelect: (files: File[]) => void;
  disabled?: boolean;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onFilesSelect, disabled }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const validateFile = (file: File): string | null => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return 'Only PDF files are supported';
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return 'File size must be less than 10MB';
    }
    return null;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, [disabled]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  }, [disabled]);

  const processFiles = (newFiles: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    newFiles.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    setUploadErrors(errors);
    
    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFilesSelect(updatedFiles);
    }
  };

  const removeFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesSelect(newFiles);
  }, [files, onFilesSelect]);

  const clearErrors = () => {
    setUploadErrors([]);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
          <Upload className="w-5 h-5 text-secondary-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Resume Upload</h2>
          <p className="text-gray-600">Upload candidate resumes for AI analysis</p>
        </div>
      </div>

      {uploadErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800 mb-2">Upload Errors:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {uploadErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
              <button
                onClick={clearErrors}
                className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive && !disabled
            ? 'border-primary-400 bg-primary-50'
            : disabled
            ? 'border-gray-200 bg-gray-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="space-y-4">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
            disabled ? 'bg-gray-200' : 'bg-primary-100'
          }`}>
            <Upload className={`w-8 h-8 ${disabled ? 'text-gray-400' : 'text-primary-600'}`} />
          </div>
          
          <div>
            <p className={`text-lg font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
              {disabled ? 'Processing resumes...' : 'Drop PDF resume files here'}
            </p>
            <p className={`text-sm ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>
              or click to browse • PDF files only • Max 10MB per file
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Ready for Analysis ({files.length} {files.length === 1 ? 'file' : 'files'})
          </h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • PDF
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  {!disabled && (
                    <button
                      onClick={() => removeFile(index)}
                      className="w-6 h-6 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>AI Analysis:</strong> Our system will extract candidate information from each PDF, 
          analyze skills and experience, and rank candidates based on job requirements. 
          Ensure resumes are text-based PDFs for best results.
        </p>
      </div>
    </div>
  );
};