'use client';

import { useState } from 'react';
import { TreatmentItem, DocumentFile } from '@/types';
import { FileText, Upload, X, File, Image, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  uploadDocumentFile,
  deleteDocumentFile,
  validateFile,
  formatFileSize,
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE,
} from '@/lib/supabaseStorage';

interface DocumentationUploadProps {
  item: TreatmentItem;
  caseId: string;
  onSave: (note: string, files: DocumentFile[], timestamp: Date) => void;
  onClose: () => void;
}

export const DocumentationUpload = ({
  item,
  caseId,
  onSave,
  onClose,
}: DocumentationUploadProps) => {
  const [note, setNote] = useState(item.documentation?.note || '');
  const [files, setFiles] = useState<DocumentFile[]>(item.documentation?.files || []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setError('');
    setUploading(true);

    try {
      const uploadPromises = Array.from(selectedFiles).map((file) =>
        uploadDocumentFile(file, caseId, item.code)
      );

      const uploadedFiles = await Promise.all(uploadPromises);
      setFiles([...files, ...uploadedFiles]);
      setSuccess(`${uploadedFiles.length} file(s) uploaded successfully`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload files');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveFile = async (fileId: string) => {
    try {
      await deleteDocumentFile(fileId);
      setFiles(files.filter((f) => f.id !== fileId));
      setSuccess('File removed successfully');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to remove file');
    }
  };

  const handleSave = () => {
    const timestamp = new Date();
    onSave(note, files, timestamp);
  };

  const getFileIcon = (type: DocumentFile['type']) => {
    if (type === 'image') return <Image className="w-5 h-5 text-blue-600" />;
    if (type === 'pdf') return <File className="w-5 h-5 text-red-600" />;
    return <File className="w-5 h-5 text-gray-600" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Add Documentation
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Procedure:</span> {item.description}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Code:</span>{' '}
              <span className="font-mono">{item.code}</span>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clinical Notes
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter clinical findings, test results, observations, or any relevant documentation..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Documents
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Accepted formats: JPG, PNG, PDF (Max {MAX_FILE_SIZE / 1024 / 1024}MB)
              </p>
              <input
                type="file"
                onChange={handleFileSelect}
                accept={Object.values(ACCEPTED_FILE_TYPES).flat().join(',')}
                multiple
                disabled={uploading}
                className="hidden"
                id={`file-upload-${item.code}`}
              />
              <label
                htmlFor={`file-upload-${item.code}`}
                className={`inline-block px-4 py-2 bg-primary-600 text-white rounded-lg font-medium cursor-pointer hover:bg-primary-700 transition-colors ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uploading ? 'Uploading...' : 'Select Files'}
              </label>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uploaded Files ({files.length})
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} •{' '}
                          {new Date(file.uploadedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(file.id)}
                      className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      aria-label="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!note && files.length === 0}
              className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Save Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
