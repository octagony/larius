'use client';

import { useAppSelector } from '@/lib/hooks';

export default function Spinner() {
  const isLoading = useAppSelector((state) => state.loader.isLoading);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white"
        role="status"
      />
    </div>
  );
}
