export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="skeleton h-5 w-2/3 rounded-md" />
      <div className="mt-3 skeleton h-3 w-1/3 rounded-md" />
      <div className="mt-5 space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="skeleton h-3 w-full rounded" />
        ))}
      </div>
    </div>
  );
}
