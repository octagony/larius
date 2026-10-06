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
