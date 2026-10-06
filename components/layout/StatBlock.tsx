import { IStatBlock } from '@/lib/interfaces/components/IStatBlock';

export function StatBox({ label, value, color }: IStatBlock) {
  return (
    <div className={`p-4 rounded-lg border ${color}`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm font-medium opacity-80">{label}</div>
    </div>
  );
}
