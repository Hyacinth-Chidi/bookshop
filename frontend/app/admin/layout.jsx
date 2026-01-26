
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { AdminPreferencesProvider } from '@/context/AdminPreferencesContext';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { PageLoader } from '@/components/shared/Loading';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Don't redirect on login page
    if (pathname === '/admin/login') return;

    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, pathname, router]);

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Show login page without sidebar
  if (pathname === '/admin/login') {
    return children;
  }

  // Show loader while checking auth
  if (loading) {
    return <PageLoader />;
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <AdminPreferencesProvider>
      {/* Mobile Header */}
      <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Content */}
      <main className={`flex-1 overflow-auto pt-16 lg:pt-0 pb-20 lg:pb-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      }`}>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}

      {/* Mobile Bottom Navigation */}

      </AdminPreferencesProvider>
    </div>
  );
}