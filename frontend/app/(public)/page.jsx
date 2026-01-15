/**
 * ============================================
 * HOME PAGE (ACTIVE)
 * ============================================
 * Landing page with featured books - Mobile Responsive
 * Refactored to use TanStack Query for data fetching
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookGrid from '@/components/books/BookGrid';
import BookSearch from '@/components/books/BookSearch';
import Button from '@/components/shared/Button';
import { useBooks } from '@/hooks/useBooks';

export default function HomePage() {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const router = useRouter();

  // TanStack Query - fetch featured books
  const { data, isLoading } = useBooks({ limit: 15, inStock: 'true' });
  const books = data?.books || [];

  useEffect(() => {
    checkShopStatus();
  }, []);

  const checkShopStatus = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sun, 1 = Mon ...
    const hour = now.getHours();

    // Open Mon(1) - Fri(5), 10:00 AM - 3:00 PM (15:00)
    const isWeekday = day >= 1 && day <= 5;
    const isOpenHours = hour >= 10 && hour < 15;

    setIsShopOpen(isWeekday && isOpenHours);
  };

  const handleSearch = (query) => {
    if (query.trim()) {
      router.push(`/books?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="relative overflow-hidden bg-neutral-900 text-white min-h-[500px] lg:min-h-[600px] flex items-center">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-dark/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-12 lg:py-0">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Text & Search Content */}
            <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                  <span className={`flex h-2 w-2 rounded-full ${isShopOpen ? 'bg-success animate-pulse' : 'bg-error'}`}></span>
                  <span className="text-xs font-medium text-neutral-200">
                    {isShopOpen ? 'Bookshop is Open (10am - 3pm)' : 'Bookshop is Closed'}
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-110">
                  Find Your 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">
                    {' '}Academic Books
                  </span>
                </h1>
                <p className="text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
                   The official ESUT Bookshop inventory system. Check real-time availability, prices, and manual details instantly.
                </p>
              </div>

              <div className="bg-white/5 p-2 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl max-w-xl mx-auto">
                <BookSearch onSearch={handleSearch} />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
                <Link href="/books" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20 justify-center">
                    Browse Books
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Featured Books Section */}
      <section className="py-10 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                Recently Added Books 
              </h2>
              <p className="text-sm sm:text-base text-neutral-500 mt-1 sm:mt-2">
                Currently in stock at the bookshop
              </p>
            </div>
            <Link href="/books" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto">
                View All Books
              </Button>
            </Link>
          </div>
          <BookGrid books={books} loading={isLoading} />
        </div>
      </section>

      <Footer />
    </div>
  );
}