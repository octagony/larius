import { toast } from '@/components/ui/toast';
import { IProcessUrl, TPriorityToast, TStatusToast } from './interfaces/helpers/IHelper.interface';

//GET INITIAL THEME HELPER
export const getInitialTheme = (): boolean => {
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('darkTheme');
    if (storedTheme !== null) {
      return JSON.parse(storedTheme);
    }
    localStorage.setItem('darkTheme', JSON.stringify(true));
    return true;
  }
  return true;
};

// SHADCN TOAST HELPER
export const setToast = (type: TStatusToast, title: string, priority: TPriorityToast) => {
  toast.add({
    type,
    title,
    priority,
  });
};

// NORMALIZE & VALIDATE URL HELPER FOR ADDING PROTOCOL
export const processUrl = (input: string): IProcessUrl => {
  const trimmed = input.trim();

  if (!trimmed) {
    return { isValid: false, url: '', error: 'Hmm...input is empty' };
  }

  const normalizedURL = trimmed.replace(/^https?:\/\//i, '');

  if (new URL(`http://${normalizedURL}`)) {
    return { isValid: true, url: normalizedURL, error: '' };
  }

  return {
    isValid: false,
    url: '',
    error: 'Please enter a valid URL (example, https://example.com)',
  };
};
