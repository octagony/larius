'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/lib/state/hooks';
import { showLoader, hideLoader } from '@/lib/state/features/loaderSlice';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { Table, TableBody, TableHead, TableHeader, TableRow } from './ui/table';
import { IScanResult } from '@/lib/interfaces/components/IFileUploader';
import { setPoolingMessage } from '@/lib/state/features/poolingMessageSlice';

export function FileUploader() {
  const dispatch = useAppDispatch();
  const [pollingMessage, setPollingMessage] = useState('');
  const [result, setResult] = useState<IScanResult | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResult(null);
    dispatch(showLoader());

    try {
      const clientFormData = new FormData();
      clientFormData.append('file', file);

      const uploadRes = await fetch('/api/vt/upload', {
        method: 'POST',
        body: clientFormData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Ошибка загрузки');

      await pollAnalysisResults(uploadData.analysisId, file.name);
    } catch (err: any) {
      toast.add({
        type: 'error',
        title: err.message,
        priority: 'high',
      });
    } finally {
      dispatch(hideLoader());
      e.target.value = '';
    }
  };

  const pollAnalysisResults = async (analysisId: string, fileName: string) => {
    const maxAttempts = 20;
    let attempts = 0;
    let interval = 2000;

    while (attempts < maxAttempts) {
      const timeLeft = (((maxAttempts - attempts) * interval) / 1000).toFixed(0);
      dispatch(setPoolingMessage(`Analysis ${fileName}... (remaining ~${timeLeft} sec)`));

      try {
        const res = await fetch(`/api/vt/status?analysisId=${analysisId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Error getting the status');
        }

        if (data.status === 'completed') {
          setResult(data);
          setPollingMessage('');
          return;
        }

        if (data.status === 'failed') {
          throw new Error('The analysis failed');
        }

        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error('The waiting time for analysis has been exceeded. Try again later.');
        }

        await new Promise((resolve) => setTimeout(resolve, Math.min(interval * 1.5, 8000)));
      } catch (err: any) {
        toast.add({
          type: 'error',
          title: err.message,
          priority: 'high',
        });
        return;
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Input className="px-4" id="file" type="file" onChange={handleFileChange} />

      {result && result.stats && (
        <div className="p-6 dark:bg-black bg-white border rounded-lg shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">Scan Report</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <StatBox
              label="Malicious"
              value={result.stats.malicious || 0}
              color="bg-red-100 text-red-700 border-red-200"
            />
            <StatBox
              label="Suspicious"
              value={result.stats.suspicious || 0}
              color="bg-yellow-100 text-yellow-700 border-yellow-200"
            />
            <StatBox
              label="Safe"
              value={result.stats.harmless || 0}
              color="bg-green-100 text-green-700 border-green-200"
            />
            <StatBox
              label="Not detected"
              value={result.stats.undetected || 0}
              color="bg-gray-100 text-gray-700 border-gray-200"
            />
          </div>

          <div className="pt-4 border-t">
            <div className="max-h-60 overflow-y-auto text-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Antivirus</TableHead>
                    <TableHead>Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(result.results).map(([engine, data]: [string, any]) => (
                    <TableRow key={engine}>
                      <TableHead>{engine}</TableHead>
                      <TableHead
                        className={`${data.category === 'malicious' ? 'text-red-600' : data.category === 'suspicious' ? 'text-yellow-600' : 'text-green-600'}`}
                      >
                        {data.method}
                      </TableHead>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`p-4 rounded-lg border ${color}`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm font-medium opacity-80">{label}</div>
    </div>
  );
}
