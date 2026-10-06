import { ReactNode } from 'react';

export interface ITextInputProps {
  model: string;
  setModel: React.Dispatch<React.SetStateAction<string>>;
  children: ReactNode;
}
