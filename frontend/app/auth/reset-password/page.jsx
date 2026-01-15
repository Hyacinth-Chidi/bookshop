'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { resetPassword } from '@/lib/adminApi';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { Lock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');

    if (!tokenParam || !emailParam) {
      toast.error('Invalid reset link');
      router.push('/admin/login');
    } else {
      setToken(tokenParam);
      setEmail(emailParam);
    }
  }, [searchParams, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        email,
        token,
        newPassword: formData.newPassword,
      });
      setSuccess(true);
      toast.success('Password reset successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 p-2">
            <Image
              src="/esut logo.png"
              alt="ESUT Logo"
              width={64}
              height={64}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-neutral-100">Enter your new password</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                placeholder="Confirm new password"
              />

              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <p className="text-sm text-warning">
                  Password must be at least 8 characters and contain uppercase, lowercase, number, and special character.
                </p>
              </div>

              <Button type="submit" variant="primary" fullWidth size="lg" loading={loading} disabled={loading}>
                <Lock className="w-5 h-5 mr-2" />
                Reset Password
              </Button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Password Reset Successful!</h3>
              <p className="text-neutral-700 mb-6">
                Your password has been reset. You can now log in with your new password.
              </p>
              <Link href="/admin/login">
                <Button variant="primary" fullWidth>
                  Go to Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}