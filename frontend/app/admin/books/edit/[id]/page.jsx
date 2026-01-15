'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useBook, useUpdateBook } from '@/hooks/useBooks';
import BookForm from '@/components/admin/BookForm';
import { PageLoader } from '@/components/shared/Loading';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditBookPage({ params }) {
  // Unwrap params Promise (Next.js 15+ requirement)
  const { id } = use(params);
  const router = useRouter();

  // TanStack Query hooks
  const { data: book, isLoading, error } = useBook(id);
  const updateBookMutation = useUpdateBook();

  const handleSubmit = async (formData) => {
    updateBookMutation.mutate(
      { id, formData },
      {
        onSuccess: () => {
          router.push('/admin/books');
        },
      }
    );
  };

  if (isLoading) return <PageLoader />;

  if (error || !book) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12">
          <p className="text-error mb-4">Failed to load book</p>
          <Link href="/admin/books" className="text-primary hover:underline">
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Edit Book</h1>
      </div>

      <BookForm initialData={book} onSubmit={handleSubmit} loading={updateBookMutation.isPending} />
    </div>
  );
}