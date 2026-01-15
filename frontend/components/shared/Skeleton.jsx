/**
 * ============================================
 * SKELETON LOADER COMPONENT
 * ============================================
 * Reusable skeleton loading component with app color palette
 */

export function SkeletonLine({ width = 'w-full', height = 'h-4' }) {
  return (
    <div className={`${width} ${height} bg-gradient-to-r from-neutral-200 to-neutral-100 rounded-md animate-pulse`} />
  );
}

export function SkeletonCard({ lines = 3, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-neutral-200 p-6 ${className}`}>
      <SkeletonLine height="h-6" width="w-1/3" />
      <div className="space-y-3 mt-4">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLine key={i} height="h-4" width={i === lines - 1 ? 'w-2/3' : 'w-full'} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonInput({ className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <SkeletonLine height="h-4" width="w-1/4" />
      <SkeletonLine height="h-10" width="w-full" />
    </div>
  );
}

export function SkeletonButton({ width = 'w-full' }) {
  return <SkeletonLine height="h-10" width={width} />;
}

export function SkeletonSettingsHeader() {
  return (
    <div className="flex items-center gap-3 mb-8">
      <SkeletonLine height="h-8" width="w-8" />
      <SkeletonLine height="h-8" width="w-1/4" />
    </div>
  );
}

export function SkeletonFacultyList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border border-neutral-200 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-neutral-100">
            <div className="flex-1">
              <SkeletonLine height="h-5" width="w-1/3" />
            </div>
            <SkeletonLine height="h-5" width="w-8" />
          </div>
        </div>
      ))}
    </div>
  );
}
