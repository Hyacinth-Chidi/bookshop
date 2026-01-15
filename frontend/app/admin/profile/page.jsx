'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { changePassword } from '@/lib/adminApi';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { User, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProfilePage() {
  const { admin } = useAdminAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success('Password changed successfully');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-4 sm:mb-6">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Profile Info */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 truncate">{admin?.username}</h2>
              <p className="text-sm sm:text-base text-neutral-500 capitalize">{admin?.role}</p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-neutral-500 mb-0.5 sm:mb-1">Username</label>
              <p className="text-sm sm:text-base text-neutral-900">{admin?.username}</p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-neutral-500 mb-0.5 sm:mb-1">Email</label>
              <p className="text-sm sm:text-base text-neutral-900 break-all">{admin?.email}</p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-neutral-500 mb-0.5 sm:mb-1">Role</label>
              <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${admin?.role === 'admin'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-info/10 text-info'
                }`}>
                {admin?.role === 'admin' ? 'Administrator' : 'Sub-Administrator'}
              </span>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">Change Password</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              required
              placeholder="Enter current password"
            />
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              required
              placeholder="Enter new password"
            />
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              placeholder="Confirm new password"
            />

            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-warning">
                Password must be at least 8 characters and contain uppercase, lowercase, number, and special character.
              </p>
            </div>

            <Button type="submit" variant="primary" fullWidth loading={loading} disabled={loading}>
              Change Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}