'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAdminAuth } from '@/context/AdminAuthContext';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { LogIn } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAdminAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in - use useEffect to avoid render-time state update
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData);
    } catch (error) {
      // Error handled by context
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Don't render the page if redirecting
  if (isAuthenticated) {
    return null;
  }

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
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            ESUT Bookshop
          </h1>
          <p className="text-neutral-100">Admin Panel Login</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-6">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />

            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:text-primary-dark transition-smooth"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
              disabled={loading}
            >
              <LogIn className="w-5 h-5 mr-2" />
              Login
            </Button>
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-neutral-500 hover:text-primary transition-smooth"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}