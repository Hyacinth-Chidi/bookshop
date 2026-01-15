/**
 * ============================================
 * LOADING COMPONENT
 * ============================================
 * Loading spinners and skeletons
 */

export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        className={`animate-spin text-primary ${sizes[size]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="xl" />
    </div>
  );
}


export function BookCardSkeleton() {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md animate-pulse">
      <div className="w-full h-64 bg-neutral-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-neutral-200 rounded w-3/4" />
        <div className="h-4 bg-neutral-200 rounded w-1/2" />
        <div className="h-8 bg-neutral-200 rounded w-full mt-4" />
      </div>
    </div>
  );
}

export function BooksPageSkeleton() {
  return (
    <div className="flex-1 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-9 w-48 bg-neutral-200 rounded mb-4" />
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 h-12 bg-neutral-200 rounded" />
            <div className="w-24 h-12 bg-neutral-200 rounded sm:w-32" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Skeleton */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="space-y-6 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-5 w-24 bg-neutral-200 rounded" />
                  <div className="h-10 w-full bg-neutral-200 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between animate-pulse">
              <div className="h-5 w-32 bg-neutral-200 rounded" />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {[...Array(8)].map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;