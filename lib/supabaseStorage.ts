import { DocumentFile } from '@/types';

export const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/pdf': ['.pdf'],
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (!Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPG, PNG, and PDF files are accepted.',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`,
    };
  }

  return { valid: true };
};

export const getFileType = (mimeType: string): 'image' | 'pdf' | 'other' => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType === 'application/pdf') return 'pdf';
  return 'other';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const uploadDocumentFile = async (
  file: File,
  caseId: string,
  procedureCode: string
): Promise<DocumentFile> => {
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const fileId = `${caseId}-${procedureCode}-${Date.now()}-${file.name}`;
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const base64Data = reader.result as string;

      const documentFile: DocumentFile = {
        id: fileId,
        name: file.name,
        url: base64Data,
        type: getFileType(file.type),
        size: file.size,
        uploadedAt: new Date(),
      };

      resolve(documentFile);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

export const deleteDocumentFile = async (fileId: string): Promise<void> => {
  console.log(`Deleting file: ${fileId}`);
};
