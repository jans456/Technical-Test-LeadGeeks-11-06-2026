interface Props {
  label: string;
  value: number;
  color: string;
}

export default function StatsCard({ label, value, color }: Props) {
  return (
    <div className={`rounded-xl p-5 text-white ${color}`}>
      <p className="text-sm font-medium opacity-90">{label}</p>
      <p className="mt-1 text-4xl font-bold">{value}</p>
    </div>
  );
}
