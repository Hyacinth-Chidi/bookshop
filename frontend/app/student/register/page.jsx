/**
 * ============================================
 * STUDENT REGISTRATION PAGE (INACTIVE)
 * ============================================
 * Student sign up form
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
import { Book, UserPlus } from 'lucide-react';

export default function StudentRegisterPage() {
  // const { register } = useStudentAuth(); // INACTIVE
  const [formData, setFormData] = useState({
    email: '',
    regNo: '',
    password: '',
    confirmPassword: '',
    level: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Mock registration - replace with actual API call when active
      // await register({
      //   email: formData.email,
      //   regNo: formData.regNo,
      //   password: formData.password,
      //   level: formData.level,
      // });
      
      console.log('Registration data:', formData);
      alert('Registration successful! (INACTIVE - This will work when activated)');
    } catch (error) {
      alert('Registration failed');
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
            Student Registration
          </h1>
          <p className="text-neutral-500">Create your account to start purchasing books</p>
        </div>

        {/* INACTIVE Notice */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-warning font-medium">
            ⚠️ INACTIVE FEATURE: This registration is not active yet. It will work when student features are enabled.
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
              label="Registration Number"
              name="regNo"
              value={formData.regNo}
              onChange={handleChange}
              required
              placeholder="e.g., 2020/12345"
            />

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Level <span className="text-error">*</span>
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Level</option>
                <option value="100L">100L</option>
                <option value="200L">200L</option>
                <option value="300L">300L</option>
                <option value="400L">400L</option>
                <option value="500L">500L</option>
              </select>
            </div>

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a strong password"
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />

            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
              <p className="text-sm text-info">
                Password must be at least 8 characters with uppercase, lowercase, and number.
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
              disabled={loading}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Create Account
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-700">
              Already have an account?{' '}
              <Link href="/student/login" className="text-primary hover:text-primary-dark font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}