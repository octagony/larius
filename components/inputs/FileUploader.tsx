'use client';

import { useDropzone } from 'react-dropzone';
import { IFileUploaderProps } from '@/lib/interfaces/components/IFileUploader.interface';
import { Card } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { MAX_FILE_SIZE } from '@/lib/constants';
import { setToast } from '@/lib/helpers';
import { useMemo } from 'react';

export function FileUploader({ onFileSelect }: IFileUploaderProps) {
  const onDrop = useMemo(
    () => (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        return;
      }

      const file = acceptedFiles[0];

      if (file.size > MAX_FILE_SIZE) {
        setToast('error', `File "${file.name}" exceeds 32 MB limit`, 'high');
        return;
      }

      onFileSelect(file);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Card
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center p-10 transition-all cursor-pointer
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50'}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-muted rounded-full">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-lg font-semibold">
              {isDragActive ? 'Drop file here...' : "Drag 'n' drop file here, or click to select"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              You can upload 1 file (up to 32 MB)
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
