'use client';

import { useDashboardStats } from '@/hooks/useAdmin';
import { useFaculties } from '@/hooks/useFaculties';
import { useSystemSettings } from '@/hooks/useSettings';
import StatsCard from '@/components/admin/StatsCard';
import { Status, StatusIndicator, StatusLabel } from '@/components/kibo-ui/status';
import Link from 'next/link';
import { Book, Users, CheckCircle, XCircle, Plus, LayoutGrid, Building2, GraduationCap } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminDashboardPage() {
  const { admin } = useAdminAuth();
  
  // TanStack Query - fetch dashboard stats
  const { data: stats, isLoading } = useDashboardStats();
  const { data: faculties = [], isLoading: loadingFaculties } = useFaculties();
  const { data: settings } = useSystemSettings();

  // Calculate stats
  const totalFaculties = faculties.length;
  const totalDepartments = faculties.reduce((acc, curr) => acc + (curr.departments?.length || 0), 0);
  
  const loading = isLoading || loadingFaculties;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-neutral-500">
            Welcome back, {admin?.username}!
          </p>
        </div>

        {/* System Status Indicators */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
          <Status status="online" className="px-2 sm:px-3 py-1 sm:py-1.5">
            <StatusIndicator />
            <div className="flex items-center gap-1.5 ml-1">
              <span className="text-xs sm:text-sm text-neutral-500 font-medium hidden sm:inline">Active Session:</span>
              <span className="text-xs sm:text-sm font-bold text-neutral-900">{settings?.currentSession || '...'}</span>
            </div>
          </Status>
          
          <Status status="maintenance" className="px-2 sm:px-3 py-1 sm:py-1.5">
            <StatusIndicator />
            <div className="flex items-center gap-1.5 ml-1">
              <span className="text-xs sm:text-sm text-neutral-500 font-medium hidden sm:inline">Active Semester:</span>
              <span className="text-xs sm:text-sm font-bold text-neutral-900">{settings?.currentSemester || '...'}</span>
            </div>
          </Status>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <StatsCard
          title="Total Books"
          value={loading ? '...' : stats?.totalBooks ?? 0}
          icon={Book}
          color="primary"
        />
        <StatsCard
          title="Total Faculties"
          value={loading ? '...' : totalFaculties}
          icon={Building2}
          color="warning"
        />
        <StatsCard
          title="Total Departments"
          value={loading ? '...' : totalDepartments}
          icon={GraduationCap}
          color="info"
        />
        {admin?.role === 'admin' && (
          <StatsCard
            title="Sub-Admins"
            value={loading ? '...' : stats?.totalSubAdmins ?? 0}
            icon={Users}
            color="info"
          />
        )}
        <StatsCard
          title="In Stock"
          value={loading ? '...' : stats?.inStockBooks ?? 0}
          icon={CheckCircle}
          color="success"
        />
        <StatsCard
          title="Out of Stock"
          value={loading ? '...' : stats?.outOfStockBooks ?? 0}
          icon={XCircle}
          color="error"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Link
            href="/admin/books/create"
            className="group p-4 border-2 border-dashed border-neutral-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="flex items-center gap-3 sm:block sm:text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center sm:mx-auto sm:mb-3 group-hover:bg-primary/20 transition-colors">
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="flex-1 sm:flex-none">
                <p className="font-medium text-neutral-900 text-sm sm:text-base">Add New Book</p>
                <p className="text-xs sm:text-sm text-neutral-500 mt-0.5 sm:mt-1">
                  Add a book to the inventory
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/books"
            className="group p-4 border-2 border-dashed border-neutral-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="flex items-center gap-3 sm:block sm:text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-info/10 flex items-center justify-center sm:mx-auto sm:mb-3 group-hover:bg-info/20 transition-colors">
                <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 text-info" />
              </div>
              <div className="flex-1 sm:flex-none">
                <p className="font-medium text-neutral-900 text-sm sm:text-base">Manage Books</p>
                <p className="text-xs sm:text-sm text-neutral-500 mt-0.5 sm:mt-1">
                  View and edit all books
                </p>
              </div>
            </div>
          </Link>

          {admin?.role === 'admin' && (
            <Link
              href="/admin/sub-admins"
              className="group p-4 border-2 border-dashed border-neutral-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all sm:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center gap-3 sm:block sm:text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-success/10 flex items-center justify-center sm:mx-auto sm:mb-3 group-hover:bg-success/20 transition-colors">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
                </div>
                <div className="flex-1 sm:flex-none">
                  <p className="font-medium text-neutral-900 text-sm sm:text-base">Manage Sub-Admins</p>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-0.5 sm:mt-1">
                    Add or remove sub-admins
                  </p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}