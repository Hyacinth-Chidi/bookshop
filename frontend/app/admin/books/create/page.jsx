'use client';

import { useRouter } from 'next/navigation';
import { useCreateBook } from '@/hooks/useBooks';
import BookForm from '@/components/admin/BookForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateBookPage() {
  const router = useRouter();
  
  // TanStack Query mutation
  const createBookMutation = useCreateBook();

  const handleSubmit = async (formData) => {
    createBookMutation.mutate(formData, {
      onSuccess: () => {
        router.push('/admin/books');
      },
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/books"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-4 transition-smooth text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Back to Books
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Add New Book</h1>
      </div>

      <BookForm onSubmit={handleSubmit} loading={createBookMutation.isPending} />
    </div>
  );
}