/**
 * ============================================
 * STATS CARD COMPONENT
 * ============================================
 * Dashboard statistics card - Mobile responsive
 */

export default function StatsCard({ title, value, icon: Icon, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary-light text-primary-dark',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    error: 'bg-error/20 text-error',
    info: 'bg-info/20 text-info',
  };

  return (
    <div className="bg-card rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md transition-smooth border border-neutral-100">
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Icon - Left side on mobile */}
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClasses[color]}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-neutral-500 font-medium truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-neutral-900">{value}</p>
        </div>
      </div>
    </div>
  );
}