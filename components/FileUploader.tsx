'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppDispatch } from '@/lib/state/hooks';
import { showLoader, hideLoader } from '@/lib/state/features/loaderSlice';
import { toast } from '@/components/ui/toast';
import { Table, TableBody, TableHead, TableHeader, TableRow } from './ui/table';
import { IScanResult } from '@/lib/interfaces/components/IFileUploader';
import { setPoolingMessage } from '@/lib/state/features/poolingMessageSlice';
import { StatBlock } from '@/components/layout/StatBlock';
import { Card } from '@/components/ui/card';
import { CircleCheck, CircleX, TriangleAlert, Upload } from 'lucide-react';
import {
  MALICIOS_FILE_CATEGORY,
  MALICIOUS_FILE_TITLE,
  MAX_FILE_SIZE,
  NOT_DETECTED_FILE_TITLE,
  SAFE_FILE_TITLE,
  SUSPICIOUS_FILE_CATEGORY,
  SUSPICIOUS_FILE_TITLE,
} from '@/lib/constants';

export function FileUploader() {
  const dispatch = useAppDispatch();
  const [result, setResult] = useState<IScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0];

    if (file.size > MAX_FILE_SIZE) {
      toast.add({
        type: 'error',
        title: `File "${file.name}" exceeds 32 MB limit`,
        priority: 'high',
      });
      return;
    }

    setResult(null);
    startScan(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    disabled: isScanning,
    accept: {
      '*/*': [],
    },
  });

  const startScan = async (file: File) => {
    setIsScanning(true);
    dispatch(showLoader());

    try {
      const clientFormData = new FormData();
      clientFormData.append('file', file);

      const uploadRes = await fetch('/api/vt/upload', {
        method: 'POST',
        body: clientFormData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'Upload error');
      }

      await pollAnalysisResults(uploadData.analysisId, file.name);
    } catch (err: any) {
      toast.add({
        type: 'error',
        title: err.message,
        priority: 'high',
      });
    } finally {
      dispatch(hideLoader());
      setIsScanning(false);
    }
  };

  const pollAnalysisResults = async (analysisId: string, fileName: string): Promise<void> => {
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
          dispatch(setPoolingMessage(''));
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
        dispatch(setPoolingMessage(''));
        return;
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Card
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed transition-all cursor-pointer
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50'}
          ${isScanning ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-muted rounded-full">
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-lg font-semibold">
              {isDragActive ? 'Drop file here...' : "Drag 'n' drop file here, or click to select"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              You can upload 1 file (up to 32 MB)
            </p>
          </div>
        </div>
      </Card>

      {result && result.stats && (
        <div className="p-6 dark:bg-black bg-white border rounded-lg shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">Scan Report</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <StatBlock
              label={MALICIOUS_FILE_TITLE}
              value={result.stats.malicious || 0}
              color="bg-red-100 text-red-700 border-red-200"
            />
            <StatBlock
              label={SUSPICIOUS_FILE_TITLE}
              value={result.stats.suspicious || 0}
              color="bg-yellow-100 text-yellow-700 border-yellow-200"
            />
            <StatBlock
              label={SAFE_FILE_TITLE}
              value={result.stats.harmless || 0}
              color="bg-green-100 text-green-700 border-green-200"
            />
            <StatBlock
              label={NOT_DETECTED_FILE_TITLE}
              value={result.stats.undetected || 0}
              color="bg-gray-100 text-gray-700 border-gray-200"
            />
          </div>

          <div className="pt-4 border-t">
            <div className="max-h-80 overflow-y-auto text-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Antivirus</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(result.results).map(([engine, data]: [string, any]) => (
                    <TableRow key={engine}>
                      <TableHead>{engine}</TableHead>
                      <TableHead
                        className={`${data.category === MALICIOS_FILE_CATEGORY ? 'text-red-600' : data.category === SUSPICIOUS_FILE_CATEGORY ? 'text-yellow-600' : 'text-green-600'}`}
                      >
                        {data.category === MALICIOS_FILE_CATEGORY
                          ? `${(<CircleX />)} ${MALICIOUS_FILE_TITLE}`
                          : data.category === SUSPICIOUS_FILE_CATEGORY
                            ? `${(<TriangleAlert />)} ${SUSPICIOUS_FILE_TITLE}`
                            : `${(<CircleCheck />)} ${SAFE_FILE_TITLE}`}
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
