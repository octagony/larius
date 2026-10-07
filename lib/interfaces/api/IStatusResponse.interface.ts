export interface IStatusAnalysisResponse {
  malicious: number;
  suspicious: number;
  harmless: number;
  undetected: number;
  timeout: number;
  'confirmed-timeout': number;
  failure: number;
  'type-unsupported': number;
  [key: string]: number;
}

export interface IEngineResult {
  category: TCategoryAnalysisResult;
  engine_name: string;
  method: string;
  result: string | null;
}

export interface IAnalysisResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      status: IAnalysisStatus;
      stats: IStatusAnalysisResponse;
      results: Record<string, IEngineResult>;
    };
  };
}

export interface IAnalysisSuccessResponse {
  status: string;
  stats: IStatusAnalysisResponse;
  results: Record<string, IEngineResult>;
}

export type TCategoryAnalysisResult = 'malicious' | 'suspicious' | 'harmless' | 'undetected';
export type IAnalysisStatus = 'queued' | 'in-progress' | 'completed' | 'failed';
