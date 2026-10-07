'use client';

import { useAppSelector } from '@/lib/state/hooks';

export default function Spinner() {
  const isLoading = useAppSelector((state) => state.loader.isLoading);
  const poolingMessage = useAppSelector((state) => state.poolingMessage.message);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col gap-2 items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white"
        role="status"
      />
      <span className="text-xl font-normal text-black dark:text-white">{poolingMessage}</span>
    </div>
  );
}
