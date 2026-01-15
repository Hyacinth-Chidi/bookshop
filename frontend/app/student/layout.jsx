/**
 * ============================================
 * STUDENT LAYOUT (INACTIVE - FUTURE FEATURE)
 * ============================================
 * Layout for all student pages
 * 
 * To activate:
 * 1. Uncomment StudentAuthProvider in app/layout.jsx
 * 2. Add student routes to main router
 * 3. Test authentication flow
 */

'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
// import { useStudentAuth } from '@/context/StudentAuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { PageLoader } from '@/components/shared/Loading';

export default function StudentLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  // const { isAuthenticated, loading } = useStudentAuth();

  // Mock loading state since context is inactive
  const loading = false;
  const isAuthenticated = false;

  useEffect(() => {
    // Skip auth check on public pages
    const publicPages = ['/student/login', '/student/register'];
    if (publicPages.includes(pathname)) return;

    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/student/login');
    }
  }, [isAuthenticated, loading, pathname, router]);

  // Show public pages without auth check
  if (pathname === '/student/login' || pathname === '/student/register') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </div>
    );
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}