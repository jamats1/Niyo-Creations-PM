// File upload utility functions

export interface FileUploadConfig {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  maxFiles?: number;
}

export const DEFAULT_FILE_CONFIG: FileUploadConfig = {
  maxSize: 50 * 1024 * 1024, // 50MB
  maxFiles: 10,
};

export const FILE_TYPE_CONFIGS = {
  images: {
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  documents: {
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxSize: 20 * 1024 * 1024, // 20MB
  },
  cad: {
    allowedTypes: ['.dwg', '.dxf', '.rvt', '.skp'],
    maxSize: 100 * 1024 * 1024, // 100MB
  },
  videos: {
    allowedTypes: ['video/mp4', 'video/mov', 'video/avi', 'video/wmv'],
    maxSize: 500 * 1024 * 1024, // 500MB
  },
};

export function validateFile(file: File, config: FileUploadConfig = DEFAULT_FILE_CONFIG): { valid: boolean; error?: string } {
  // Check file size
  if (config.maxSize && file.size > config.maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${formatFileSize(config.maxSize)}`,
    };
  }

  // Check file type
  if (config.allowedTypes && config.allowedTypes.length > 0) {
    const isValidType = config.allowedTypes.some(type => {
      if (type.startsWith('.')) {
        // Extension-based validation
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      } else {
        // MIME type validation
        return file.type === type;
      }
    });

    if (!isValidType) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${config.allowedTypes.join(', ')}`,
      };
    }
  }

  return { valid: true };
}

export function validateFiles(files: File[], config: FileUploadConfig = DEFAULT_FILE_CONFIG): { valid: boolean; error?: string } {
  // Check number of files
  if (config.maxFiles && files.length > config.maxFiles) {
    return {
      valid: false,
      error: `Maximum ${config.maxFiles} files allowed`,
    };
  }

  // Validate each file
  for (const file of files) {
    const validation = validateFile(file, config);
    if (!validation.valid) {
      return validation;
    }
  }

  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileIcon(fileType: string): string {
  if (fileType.startsWith('image/')) return 'image';
  if (fileType.startsWith('video/')) return 'video';
  if (fileType.includes('pdf')) return 'file-text';
  if (fileType.includes('word') || fileType.includes('document')) return 'file-text';
  if (fileType.includes('cad') || fileType.includes('dwg') || fileType.includes('rvt')) return 'file-text';
  return 'file';
}

export function generateFileId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createFilePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    } else {
      // For non-image files, return a placeholder
      resolve('/api/file-preview?type=' + encodeURIComponent(file.type));
    }
  });
}

export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

export function getFileCategory(file: File): 'reference' | 'production' | 'client' | 'cover' {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  
  // Cover images
  if (fileType.startsWith('image/') && fileName.includes('cover')) {
    return 'cover';
  }
  
  // Production files
  if (fileName.includes('.rvt') || fileName.includes('.dwg') || fileName.includes('.skp')) {
    return 'production';
  }
  
  // Client files
  if (fileName.includes('proposal') || fileName.includes('presentation') || fileName.includes('deliverable')) {
    return 'client';
  }
  
  // Default to reference
  return 'reference';
} 