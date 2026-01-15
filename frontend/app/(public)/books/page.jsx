/**
 * ============================================
 * BOOKS PAGE (ACTIVE)
 * ============================================
 * Browse all books with filters
 * Refactored to use TanStack Query
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookGrid from '@/components/books/BookGrid';
import { BooksPageSkeleton } from '@/components/shared/Loading';
import BookFilters from '@/components/books/BookFilters';
import BookSearch from '@/components/books/BookSearch';
import Button from '@/components/shared/Button';
import { useBooks } from '@/hooks/useBooks';
import { Filter, X } from 'lucide-react';

function BooksContent() {
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    facultyId: '',
    departmentId: '',
    level: '',
    semester: '',
    session: '',
    inStock: '',
    hasManual: '',
  });
  const [page, setPage] = useState(1);
  const limit = 20;

  // Build query params for TanStack Query
  const queryParams = {
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    ),
    page,
    limit,
  };

  // TanStack Query - fetch books with filters
  const { data, isLoading } = useBooks(queryParams);
  const books = data?.books || [];
  const pagination = data?.pagination || { total: 0, totalPages: 0 };

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [JSON.stringify(filters)]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      facultyId: '',
      departmentId: '',
      level: '',
      semester: '',
      session: '',
      inStock: '',
      hasManual: '',
    });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex-1 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Browse Books
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <BookSearch
                onSearch={handleSearch}
                initialValue={filters.search}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:w-auto"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <BookFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilters(false)}>
              <div
                className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <BookFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={clearFilters}
                />
              </div>
            </div>
          )}

          {/* Books Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-neutral-500">
                Showing {books.length} of {pagination.total} books
              </p>
            </div>

            <BookGrid books={books} loading={isLoading} />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm text-neutral-700">
                  Page {page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page === pagination.totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BooksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={<BooksPageSkeleton />}>
        <BooksContent />
      </Suspense>
      <Footer />
    </div>
  );
}