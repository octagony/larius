import { ReactNode } from 'react';

export interface IScanStats {
  malicious: number;
  suspicious: number;
  harmless: number;
  undetected: number;
  [key: string]: number;
}

export interface IScanResult {
  status: string;
  stats: IScanStats;
  results: Record<string, { category: string }>;
}

export interface IFileUploaderProps {
  onFileSelect: (file: File) => void;
  children?: ReactNode;
}
