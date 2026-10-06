export type TStatusToast = 'error' | 'success' | 'info' | 'warning';
export type TPriorityToast = 'low' | 'high';

export interface IProcessUrl {
  isValid: boolean;
  url: string;
  error: string;
}
