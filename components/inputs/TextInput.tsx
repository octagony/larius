'use client';
import { Field, FieldLabel } from '@/components/ui/field';
import { useState } from 'react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { CircleX } from 'lucide-react';
import { ITextInputProps } from '@/lib/interfaces/components/ITextInput.interface';

export function TextInput({ model, setModel, children }: ITextInputProps) {
  const handleClearInput = () => {
    setModel('');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Field>
        <FieldLabel htmlFor="input-badge">Paste URL</FieldLabel>
        <InputGroup>
          <InputGroupAddon>{'https:// '}</InputGroupAddon>
          <InputGroupInput
            className="border"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            id="input-badge"
            type="url"
            placeholder="api.example.com"
          />
          <>
            {model.trim() && (
              <InputGroupAddon
                className="pl-2 cursor-pointer"
                align={'inline-end'}
                onClick={handleClearInput}
              >
                <CircleX />
              </InputGroupAddon>
            )}
          </>
        </InputGroup>
      </Field>
      {children}
    </div>
  );
}
