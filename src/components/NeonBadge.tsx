export default function NeonBadge({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 rounded-xl text-xs bg-brand-600/15 border border-brand-500/30 text-brand-200 glow-border">
      {label}
    </span>
  )
}
