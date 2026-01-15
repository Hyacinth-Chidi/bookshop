'use client';

import { useDashboardStats } from '@/hooks/useAdmin';
import StatsCard from '@/components/admin/StatsCard';
import Link from 'next/link';
import { Book, Users, CheckCircle, XCircle, Plus, LayoutGrid } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminDashboardPage() {
  const { admin } = useAdminAuth();
  
  // TanStack Query - fetch dashboard stats
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-neutral-500">
          Welcome back, {admin?.username}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <StatsCard
          title="Total Books"
          value={isLoading ? '...' : stats?.totalBooks ?? 0}
          icon={Book}
          color="primary"
        />
        {admin?.role === 'admin' && (
          <StatsCard
            title="Sub-Admins"
            value={isLoading ? '...' : stats?.totalSubAdmins ?? 0}
            icon={Users}
            color="info"
          />
        )}
        <StatsCard
          title="In Stock"
          value={isLoading ? '...' : stats?.inStockBooks ?? 0}
          icon={CheckCircle}
          color="success"
        />
        <StatsCard
          title="Out of Stock"
          value={isLoading ? '...' : stats?.outOfStockBooks ?? 0}
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