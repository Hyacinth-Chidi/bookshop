/**
 * ============================================
 * STUDENT PROFILE PAGE (INACTIVE)
 * ============================================
 * Student profile and settings
 * 
 * To activate:
 * 1. Uncomment StudentAuthProvider in app/layout.jsx
 * 2. Uncomment useStudentAuth hook below
 * 3. Add route to main router
 */

'use client';

import { useState } from 'react';
// import { useStudentAuth } from '@/context/StudentAuthContext';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { User, Lock, Mail, CreditCard } from 'lucide-react';

export default function StudentProfilePage() {
  // const { student, logout } = useStudentAuth(); // INACTIVE
  
  // Mock student data
  const student = {
    email: 'student@esut.edu.ng',
    regNo: '2020/12345',
    level: '300L',
  };

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // INACTIVE: Add API call when ready
      console.log('Password change:', passwordData);
      alert('Password changed successfully! (INACTIVE)');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      alert('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* INACTIVE Notice */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-warning font-medium">
            ⚠️ INACTIVE FEATURE: Profile management will work when student features are activated.
          </p>
        </div>

        <h1 className="text-3xl font-bold text-neutral-900 mb-6">Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">{student.regNo}</h2>
                <p className="text-neutral-500">{student.level}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-1">
                  Email Address
                </label>
                <div className="flex items-center gap-2 text-neutral-900">
                  <Mail className="w-4 h-4 text-neutral-500" />
                  <span>{student.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-1">
                  Registration Number
                </label>
                <div className="flex items-center gap-2 text-neutral-900">
                  <CreditCard className="w-4 h-4 text-neutral-500" />
                  <span>{student.regNo}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-1">
                  Level
                </label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  {student.level}
                </span>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900">Change Password</h2>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Input
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
                placeholder="Enter current password"
              />
              <Input
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                placeholder="Enter new password"
              />
              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                placeholder="Confirm new password"
              />

              <Button type="submit" variant="primary" fullWidth loading={loading} disabled={loading}>
                Change Password
              </Button>
            </form>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-6">
          <Button
            variant="error"
            onClick={() => {
              // logout(); // INACTIVE
              alert('Logout (INACTIVE)');
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}