/**
 * ============================================
 * BOOK GRID COMPONENT
 * ============================================
 * Display books in responsive grid
 */

'use client';

import BookCard from './BookCard';
import { BookCardSkeleton } from '@/components/shared/Loading';

export default function BookGrid({ books, loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {[...Array(8)].map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full mb-6">
          <svg
            className="w-10 h-10 text-primary/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        
        {/* Message */}
        <h3 className="text-xl font-bold text-neutral-900 mb-2">
          No books match your filters
        </h3>
        <p className="text-neutral-500 mb-6 max-w-md mx-auto">
          We couldn't find any books matching your current selection. Try these suggestions:
        </p>
        
        {/* Suggestions */}
        <div className="bg-neutral-50 rounded-xl p-4 max-w-sm mx-auto text-left space-y-2">
          <p className="text-sm text-neutral-600 flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            Clear some filters to broaden your search
          </p>
          <p className="text-sm text-neutral-600 flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            Check if you selected the correct level and semester
          </p>
          <p className="text-sm text-neutral-600 flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            Try searching by course code or book title
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}