import { useAppDispatch } from '@/lib/state/hooks';
import { setPoolingMessage } from '@/lib/state/features/poolingMessageSlice';
import { IScanResult } from '@/lib/interfaces/hooks/IUsePoolAnalitycs.interface';

export function usePoolAnalytics() {
  const dispatch = useAppDispatch();

  const pollAnalysisResults = async (
    analysisId: string,
    scanName: string
  ): Promise<IScanResult> => {
    const maxAttempts = 20;
    let attempts = 0;
    const interval = 2000;
    const shortName = scanName.length > 25 ? `${scanName.slice(0, 12)}...` : scanName;

    while (attempts < maxAttempts) {
      const timeLeft = (((maxAttempts - attempts) * interval) / 1000).toFixed(0);

      dispatch(setPoolingMessage(`Analysis ${shortName}... (remaining ~${timeLeft} sec)`));

      try {
        const res = await fetch(`/api/status?analysisId=${analysisId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Error getting the status');
        }

        if (data.status === 'completed') {
          dispatch(setPoolingMessage(''));
          return data as IScanResult;
        }

        if (data.status === 'failed') {
          throw new Error('The analysis failed');
        }

        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error('The waiting time for analysis has been exceeded. Try again later.');
        }

        await new Promise((resolve) => setTimeout(resolve, Math.min(interval * 1.5, 8000)));
      } catch (err: unknown) {
        dispatch(setPoolingMessage(''));
        throw err;
      }
    }

    throw new Error('Analysis polling ended unexpectedly');
  };

  return { pollAnalysisResults };
}
