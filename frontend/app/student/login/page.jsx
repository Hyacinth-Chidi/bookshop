/**
 * ============================================
 * STUDENT LOGIN PAGE (INACTIVE)
 * ============================================
 * Student login form
 * 
 * To activate:
 * 1. Uncomment StudentAuthProvider in app/layout.jsx
 * 2. Uncomment useStudentAuth hook below
 * 3. Add route to main router
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
// import { useStudentAuth } from '@/context/StudentAuthContext';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { Book, LogIn } from 'lucide-react';

export default function StudentLoginPage() {
  // const { login } = useStudentAuth(); // INACTIVE
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock login - replace with actual API call when active
      // await login(formData);
      
      console.log('Login data:', formData);
      alert('Login successful! (INACTIVE - This will work when activated)');
    } catch (error) {
      alert('Login failed');
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

  return (
    <div className="py-12">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Book className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Student Login
          </h1>
          <p className="text-neutral-500">Login to purchase books online</p>
        </div>

        {/* INACTIVE Notice */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-warning font-medium">
            ⚠️ INACTIVE FEATURE: Student login is not active yet. It will work when student features are enabled.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@student.esut.edu.ng"
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
                href="/student/forgot-password"
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

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-700">
              Don't have an account?{' '}
              <Link href="/student/register" className="text-primary hover:text-primary-dark font-medium">
                Register here
              </Link>
            </p>
          </div>

          {/* Browse as Guest */}
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900">
              ← Browse books without account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}