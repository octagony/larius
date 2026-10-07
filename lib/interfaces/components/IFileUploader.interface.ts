import { ReactNode } from 'react';

export interface IScanStats {
  malicious: number;
  suspicious: number;
  harmless: number;
  undetected: number;
}

export interface IScanResult {
  status: string;
  stats: IScanStats;
  results: Record<
    string,
    {
      category: string;
      result: string | null;
      method?: string;
    }
  >;
}

export interface IFileUploaderProps {
  onFileSelect: (file: File) => void;
  children?: ReactNode;
}

export interface IEngineResult {
  category: string;
  result: string | null;
  method?: string;
}
