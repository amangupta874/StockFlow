const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="surface relative h-56 overflow-hidden rounded-lg p-4">
        <div className="shimmer absolute inset-y-0 left-0 w-1/2" />
        <div className="h-28 rounded-lg bg-slate-200/70 dark:bg-white/10" />
        <div className="mt-4 h-4 w-2/3 rounded bg-slate-200/80 dark:bg-white/10" />
        <div className="mt-3 h-4 w-1/2 rounded bg-slate-200/80 dark:bg-white/10" />
      </div>
    ))}
  </div>
);

export default SkeletonGrid;
