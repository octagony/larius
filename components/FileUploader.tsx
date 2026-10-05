'use client';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function FileUploader() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Field>
      <Input id="picture" type="file" max={33554432} onChange={handleFileChange} />
      <FieldDescription className="text-center">Select a file to upload</FieldDescription>
    </Field>
  );
}
