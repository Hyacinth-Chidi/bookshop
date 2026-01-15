'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { requestPasswordReset } from '@/lib/adminApi';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setSubmitted(true);
      toast.success('Password reset link sent to your email');
    } catch (error) {
      toast.error('Failed to send reset link');
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Forgot Password</h1>
          <p className="text-neutral-100">Enter your email to reset your password</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />

              <Button type="submit" variant="primary" fullWidth size="lg" loading={loading} disabled={loading}>
                <Mail className="w-5 h-5 mr-2" />
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4">
                <Mail className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Check Your Email</h3>
              <p className="text-neutral-700 mb-6">
                If an account exists with <strong>{email}</strong>, you will receive a password reset link.
              </p>
              <Link href="/admin/login">
                <Button variant="primary" fullWidth>
                  Back to Login
                </Button>
              </Link>
            </div>
          )}

          {!submitted && (
            <div className="mt-6 text-center">
              <Link href="/admin/login" className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-dark transition-smooth">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}