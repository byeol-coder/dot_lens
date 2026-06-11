export function ProgressBar({ value }: { value: number }) {
  return <div className="h-3 overflow-hidden rounded-full bg-white/10" aria-label={`진행률 ${value}%`}><div className="h-full rounded-full bg-gradient-to-r from-spiritPurple via-spiritPink to-spiritSky" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}
