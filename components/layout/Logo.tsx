import { ShieldCog } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-1 md:gap-3">
      <ShieldCog className="size-8" />
      <span className="font-bold text-base">Larius</span>
    </div>
  );
}
