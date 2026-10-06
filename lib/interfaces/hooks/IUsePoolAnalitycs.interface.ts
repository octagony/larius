export interface IScanResult {
  status: string;
  stats: {
    malicious: number;
    suspicious: number;
    harmless: number;
    undetected: number;
  };
  results: Record<string, { category: string; method?: string }>;
}
