'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useBook } from '@/hooks/useBooks';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, Book, GraduationCap, Building2, Calendar, BookOpen, FileText, User, Info } from 'lucide-react';
import { Status, StatusIndicator, StatusLabel } from '@/components/kibo-ui/status';

export default function BookDetailsPage({ params }) {
  const { id } = use(params);
  const [activeImage, setActiveImage] = useState('front');
  const router = useRouter();

  // TanStack Query - fetch book by ID
  const { data: book, isLoading, error } = useBook(id);

  // Skeleton loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Navbar />
        <div className="flex-1 py-3 sm:py-4 lg:py-6">
          <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="h-6 w-32 bg-neutral-200 rounded animate-pulse mb-6" />
            <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="bg-neutral-100 p-6 h-[500px]" />
                <div className="p-6 space-y-6">
                  <div className="h-8 w-3/4 bg-neutral-200 rounded" />
                  <div className="h-24 w-full bg-neutral-200 rounded" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-neutral-200 rounded" />
                    <div className="h-16 bg-neutral-200 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error or not found
  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">Book not found</h2>
            <button
              onClick={() => router.push('/books')}
              className="text-primary hover:underline"
            >
              Back to Books
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <div className="flex-1 py-3 sm:py-4 lg:py-6">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-neutral-600 hover:text-primary mb-3 sm:mb-4 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            <span>Back to Books</span>
          </button>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Book Images Section */}
              <div className="bg-neutral-100 p-3 sm:p-4 lg:p-6">
                {/* Main Image */}
                <div className="relative w-full aspect-[3/4] bg-white rounded-lg overflow-hidden shadow-md mb-3">
                  {(activeImage === 'front' && book.frontCover) || (activeImage === 'back' && book.backCover) || (activeImage === 'manual' && book.manualFrontCover) ? (
                    <Image
                      src={activeImage === 'front' ? book.frontCover : activeImage === 'back' ? book.backCover : book.manualFrontCover}
                      alt={book.title}
                      fill
                      className="object-contain"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Book className="w-16 h-16 sm:w-20 sm:h-20 text-neutral-300" />
                    </div>
                  )}

                  {/* Stock Badge on Image */}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                    {book.quantity > 0 ? (
                      <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-success text-white text-[10px] sm:text-xs font-semibold rounded-full shadow">
                        In Stock
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-error text-white text-[10px] sm:text-xs font-semibold rounded-full shadow">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Thumbnail Images */}
                <div className="flex gap-2">
                  {book.frontCover && (
                    <button
                      onClick={() => setActiveImage('front')}
                      className={`relative w-14 h-[4.5rem] sm:w-16 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === 'front' ? 'border-primary ring-2 ring-primary/20' : 'border-neutral-200'}`}
                    >
                      <Image src={book.frontCover} alt="Front Cover" fill className="object-cover" />
                    </button>
                  )}
                  {book.backCover && (
                    <button
                      onClick={() => setActiveImage('back')}
                      className={`relative w-14 h-[4.5rem] sm:w-16 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === 'back' ? 'border-primary ring-2 ring-primary/20' : 'border-neutral-200'}`}
                    >
                      <Image src={book.backCover} alt="Back Cover" fill className="object-cover" />
                    </button>
                  )}
                  {book.hasManual && book.manualFrontCover && (
                    <button
                      onClick={() => setActiveImage('manual')}
                      className={`relative w-14 h-[4.5rem] sm:w-16 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === 'manual' ? 'border-primary ring-2 ring-primary/20' : 'border-neutral-200'}`}
                    >
                      <Image src={book.manualFrontCover} alt="Manual Cover" fill className="object-cover" />
                      <div className="absolute inset-0 bg-info/80 flex items-center justify-center">
                        <span className="text-white text-[9px] sm:text-[10px] font-medium">Manual</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Book Details Section */}
              <div className="p-3 sm:p-4 lg:p-6">
                {/* Title */}
                <div className="mb-3 sm:mb-4">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-900 mb-2">
                    {book.title}
                  </h1>
                  {book.hasManual && (
                    <span className="inline-flex px-2 py-0.5 sm:px-3 sm:py-1 bg-info/10 text-info font-medium rounded-full text-xs sm:text-sm">
                      Includes Manual
                    </span>
                  )}
                </div>

                {/* Book Info Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="bg-neutral-50 p-2.5 sm:p-3 rounded-lg">
                    <div className="flex items-center gap-1.5 text-neutral-500 mb-0.5">
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={2.5} />
                      <span className="text-[10px] sm:text-xs">Course Code</span>
                    </div>
                    <p className="font-medium text-neutral-900 text-xs sm:text-sm">{book.courseCode}</p>
                  </div>
                  {book.courseLecturer && (
                    <div className="bg-neutral-50 p-2.5 sm:p-3 rounded-lg">
                      <div className="flex items-center gap-1.5 text-neutral-500 mb-0.5">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={2.5} />
                        <span className="text-[10px] sm:text-xs">Lecturer</span>
                      </div>
                      <p className="font-medium text-neutral-900 text-xs sm:text-sm truncate">{book.courseLecturer}</p>
                    </div>
                  )}
                  <div className="bg-neutral-50 p-2.5 sm:p-3 rounded-lg">
                    <div className="flex items-center gap-1.5 text-neutral-500 mb-0.5">
                      <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={2.5} />
                      <span className="text-[10px] sm:text-xs">Department</span>
                    </div>
                    <p className="font-medium text-neutral-900 text-xs sm:text-sm truncate">{book.department?.name || 'N/A'}</p>
                  </div>
                  <div className="bg-neutral-50 p-2.5 sm:p-3 rounded-lg">
                    <div className="flex items-center gap-1.5 text-neutral-500 mb-0.5">
                      <Building2 className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={2.5} />
                      <span className="text-[10px] sm:text-xs">Faculty</span>
                    </div>
                    <p className="font-medium text-neutral-900 text-xs sm:text-sm truncate">{book.faculty?.name || 'N/A'}</p>
                  </div>
                  <div className="bg-neutral-50 p-2.5 sm:p-3 rounded-lg">
                    <div className="flex items-center gap-1.5 text-neutral-500 mb-0.5">
                      <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={2.5} />
                      <span className="text-[10px] sm:text-xs">Level</span>
                    </div>
                    <p className="font-medium text-neutral-900 text-xs sm:text-sm">{book.level}</p>
                  </div>
                  <div className="bg-neutral-50 p-2.5 sm:p-3 rounded-lg">
                    <div className="flex items-center gap-1.5 text-neutral-500 mb-0.5">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={2.5} />
                      <span className="text-[10px] sm:text-xs">Semester</span>
                    </div>
                    <p className="font-medium text-neutral-900 text-xs sm:text-sm">{book.semester}</p>
                  </div>
                </div>

                {/* Session */}
                <div className="bg-neutral-50 p-2.5 sm:p-3 rounded-lg mb-3 sm:mb-4">
                  <p className="text-[10px] sm:text-xs text-neutral-500 mb-0.5">Academic Session</p>
                  <p className="font-medium text-neutral-900 text-xs sm:text-sm">{book.session}</p>
                </div>

                {/* Description */}
                {book.description && (
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-sm sm:text-base font-semibold text-neutral-900 mb-1.5">
                      Description
                    </h3>
                    <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                )}

                {/* Availability Status */}
                <div className="mb-3 sm:mb-4">
                  <Status status={book.quantity > 0 ? "online" : "offline"}>
                    <StatusIndicator />
                    <StatusLabel>
                      {book.quantity > 0 ? 'Available at the bookshop' : 'Currently out of stock'}
                    </StatusLabel>
                    {book.quantity > 0 && (
                      <span className="ml-auto text-xs sm:text-sm font-semibold text-neutral-600">
                        {book.quantity} {book.quantity === 1 ? 'copy' : 'copies'} left
                      </span>
                    )}
                  </Status>
                </div>

                {/* Price Card */}
                <div className="bg-gradient-to-br from-amber-900 to-amber-950 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 text-white">
                  <div className="space-y-2">
                    {book.hasManual && (
                      <>
                        <div className="flex items-center justify-between text-amber-200/80 text-sm">
                          <span>Textbook Price</span>
                          <span>{formatPrice(book.price - (book.manualPrice || 0))}</span>
                        </div>
                        <div className="flex items-center justify-between text-amber-200/80 text-sm">
                          <span>Manual Price</span>
                          <span>{formatPrice(book.manualPrice || 0)}</span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-amber-800/50 flex items-end justify-between">
                          <span className="text-amber-100 font-medium">Total Price</span>
                          <p className="text-xl sm:text-2xl font-bold">
                            {formatPrice(book.price)}
                          </p>
                        </div>
                      </>
                    )}
                    {!book.hasManual && (
                      <div className="flex items-end justify-between">
                        <span className="text-amber-100 font-medium">Price</span>
                        <p className="text-xl sm:text-2xl font-bold">
                          {formatPrice(book.price)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Manual Info */}
                {book.hasManual && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 sm:p-2.5">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                        This textbook comes with a comprehensive manual containing additional exercises.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}