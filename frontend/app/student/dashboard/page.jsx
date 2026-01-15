/**
 * ============================================
 * STUDENT DASHBOARD PAGE (INACTIVE)
 * ============================================
 * Student dashboard with overview
 * 
 * To activate:
 * 1. Uncomment StudentAuthProvider in app/layout.jsx
 * 2. Uncomment useStudentAuth hook below
 * 3. Add route to main router
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// import { useStudentAuth } from '@/context/StudentAuthContext';
import Button from '@/components/shared/Button';
import { Book, ShoppingBag, User, CreditCard } from 'lucide-react';

export default function StudentDashboardPage() {
  // const { student } = useStudentAuth(); // INACTIVE
  
  // Mock student data
  const student = {
    email: 'student@esut.edu.ng',
    regNo: '2020/12345',
    level: '300L',
  };

  const [stats, setStats] = useState({
    totalPurchases: 0,
    pendingPayments: 0,
    completedOrders: 0,
  });

  useEffect(() => {
    // Mock stats - replace with actual API call when active
    setStats({
      totalPurchases: 5,
      pendingPayments: 1,
      completedOrders: 4,
    });
  }, []);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* INACTIVE Notice */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-warning font-medium">
            ⚠️ INACTIVE FEATURE: This dashboard will work when student features are activated.
          </p>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Welcome back!
          </h1>
          <p className="text-neutral-500">
            {student.regNo} • {student.level}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 mb-2">Total Purchases</p>
                <p className="text-3xl font-bold text-neutral-900">{stats.totalPurchases}</p>
              </div>
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 mb-2">Completed Orders</p>
                <p className="text-3xl font-bold text-neutral-900">{stats.completedOrders}</p>
              </div>
              <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center">
                <Book className="w-7 h-7 text-success" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 mb-2">Pending Payments</p>
                <p className="text-3xl font-bold text-neutral-900">{stats.pendingPayments}</p>
              </div>
              <div className="w-14 h-14 bg-warning/10 rounded-full flex items-center justify-center">
                <CreditCard className="w-7 h-7 text-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/books">
                <Button variant="primary" fullWidth>
                  <Book className="w-5 h-5 mr-2" />
                  Browse Books
                </Button>
              </Link>
              <Link href="/student/purchases">
                <Button variant="outline" fullWidth>
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  View Purchase History
                </Button>
              </Link>
              <Link href="/student/profile">
                <Button variant="outline" fullWidth>
                  <User className="w-5 h-5 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <p className="text-sm text-neutral-500 text-center py-8">
                No recent activity
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}