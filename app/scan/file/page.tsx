'use client';
import { FileUploader } from '@/components/inputs/FileUploader';
import { Terms } from '@/components/layout/Terms';
import { StatBlock } from '@/components/StatBlock';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePoolAnalytics } from '@/hooks/usePoolAnalytics';
import {
  MALICIOS_FILE_CATEGORY,
  MALICIOUS_FILE_TITLE,
  NOT_DETECTED_FILE_TITLE,
  SAFE_FILE_TITLE,
  SUSPICIOUS_FILE_CATEGORY,
  SUSPICIOUS_FILE_TITLE,
} from '@/lib/constants';
import { setToast } from '@/lib/helpers';
import { IEngineResult, IScanResult } from '@/lib/interfaces/components/IFileUploader.interface';
import { hideLoader, showLoader } from '@/lib/state/features/loaderSlice';
import { useAppDispatch } from '@/lib/state/hooks';
import { CircleCheck, CircleX, TriangleAlert } from 'lucide-react';
import { useState } from 'react';

export default function FileScanPage() {
  const dispatch = useAppDispatch();
  const { pollAnalysisResults } = usePoolAnalytics();
  const [result, setResult] = useState<IScanResult | null>(null);

  const handleScanFile = async (file: File) => {
    dispatch(showLoader());

    try {
      const clientFormData = new FormData();
      clientFormData.append('file', file);

      const uploadRes = await fetch('/api/file', {
        method: 'POST',
        body: clientFormData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'Upload error');
      }

      const result = await pollAnalysisResults(uploadData.analysisId, file.name);
      setResult(result);
    } catch (err: unknown) {
      setToast('error', (err as Error).message, 'high');
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div className="h-full w-full flex flex-col flex-1 max-w-3xl mx-auto">
      <div className="pt-20 lg:pt-28 mb-4 mt-4 text-2xl font-extrabold tracking-tight leading-none md:text-3xl lg:text-4xl dark:text-white text-center">
        <h2>Scan files for viruses and suspicious items</h2>
        <div className="px-2 py-4">
          <FileUploader onFileSelect={handleScanFile} />
        </div>
        {!result && <Terms />}
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
                    {Object.entries(result.results).map(
                      ([engine, data]: [string, IEngineResult]) => (
                        <TableRow key={engine}>
                          <TableHead>{engine}</TableHead>
                          <TableHead
                            className={`${data.category === MALICIOS_FILE_CATEGORY ? 'text-red-600' : data.category === SUSPICIOUS_FILE_CATEGORY ? 'text-yellow-600' : 'text-green-600'}`}
                          >
                            <span className="flex items-center gap-2">
                              {data.category === MALICIOS_FILE_CATEGORY ? (
                                <>
                                  <CircleX size={16} /> {MALICIOUS_FILE_TITLE}
                                </>
                              ) : data.category === SUSPICIOUS_FILE_CATEGORY ? (
                                <>
                                  <TriangleAlert size={16} /> {SUSPICIOUS_FILE_TITLE}
                                </>
                              ) : (
                                <>
                                  <CircleCheck size={16} /> {SAFE_FILE_TITLE}
                                </>
                              )}
                            </span>
                          </TableHead>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
