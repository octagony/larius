'use client';
import { TextInput } from '@/components/inputs/TextInput';
import { Terms } from '@/components/layout/Terms';
import { StatBlock } from '@/components/StatBlock';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePoolAnalytics } from '@/hooks/usePoolAnalytics';
import { processUrl, setToast } from '@/lib/helpers';
import { IScanResult } from '@/lib/interfaces/components/IFileUploader.interface';
import { hideLoader, showLoader } from '@/lib/state/features/loaderSlice';
import { setPoolingMessage } from '@/lib/state/features/poolingMessageSlice';
import { cn } from 'cn';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export default function UrlScanPage() {
  const dispatch = useDispatch();
  const { pollAnalysisResults } = usePoolAnalytics();
  const [text, setText] = useState('');
  const [result, setResult] = useState<IScanResult | null>(null);

  const handleUrlSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    const normalizedURL = processUrl(text);

    if (!normalizedURL.isValid) {
      setToast('error', normalizedURL.error, 'high');
      return;
    }

    const urlForScan = normalizedURL.url;
    try {
      dispatch(showLoader());
      const res = await fetch('/api/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlForScan }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка отправки URL');
      }

      const result = await pollAnalysisResults(data.analysisId, urlForScan);
      setResult(result);
    } catch (err: any) {
      setToast('error', err.message, 'high');
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div className="h-full w-full flex flex-col flex-1 max-w-3xl mx-auto">
      <div className="pt-20 lg:pt-28 mb-4 mt-4 text-2xl font-extrabold tracking-tight leading-none md:text-3xl lg:text-4xl dark:text-white text-center">
        <h2>Scan URL's for viruses and suspicious items</h2>
        <div className="px-2 py-4 max-w-3xl">
          <TextInput model={text} setModel={setText}>
            <Button
              variant="secondary"
              className={cn(
                'max-w-min',
                'p-2',
                `${!text.trim() ? 'cursor-not-allowed' : 'cursor-pointer'}`
              )}
              type="submit"
              size="lg"
              disabled={!text.trim()}
              onClick={handleUrlSubmit}
            >
              Scan URL
            </Button>
          </TextInput>
        </div>
        {!result && <Terms />}
        {result && result.stats && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white">Scan Report</h2>
            </div>

            <Card className="p-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <StatBlock
                  label="Malicious"
                  value={result.stats.malicious || 0}
                  color="bg-red-100 text-red-700 border-red-200"
                />
                <StatBlock
                  label="Suspicious"
                  value={result.stats.suspicious || 0}
                  color="bg-yellow-100 text-yellow-700 border-yellow-200"
                />
                <StatBlock
                  label="Safe"
                  value={result.stats.harmless || 0}
                  color="bg-green-100 text-green-700 border-green-200"
                />
                <StatBlock
                  label="Not detected"
                  value={result.stats.undetected || 0}
                  color="bg-gray-100 text-gray-700 border-gray-200"
                />
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3 text-zinc-950 dark:text-white">
                  Detection Details
                </h3>
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Antivirus</TableHead>
                        <TableHead>Category</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(result.results).map(([engine, data]: [string, any]) => (
                        <TableRow key={engine}>
                          <TableHead className="font-medium">{engine}</TableHead>
                          <TableHead
                            className={`${
                              data.result === 'malicious'
                                ? 'text-red-600'
                                : data.result === 'clean'
                                  ? 'text-green-600'
                                  : 'text-gray-300'
                            }`}
                          >
                            {data.result}
                          </TableHead>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
