'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Book } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function BookCard({ book }) {
  return (
    <Link href={`/books/${book.id}`} className="block group h-full">
      <div className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
        {/* Book Cover Section */}
        <div className="relative flex-shrink-0">
          {/* Cover Image */}
          <div className="relative w-full aspect-[3/4] bg-neutral-100">
            {book.frontCover ? (
              <Image
                src={book.frontCover}
                alt={book.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
                <Book className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-400" />
              </div>
            )}
          </div>

          {/* Stock Badge */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            {book.quantity > 0 ? (
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-success text-white text-[10px] sm:text-xs font-semibold rounded-full shadow-sm">
                In Stock
              </span>
            ) : (
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-error text-white text-[10px] sm:text-xs font-semibold rounded-full shadow-sm">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Book Info - Bottom Section */}
        <div className="bg-gradient-to-br from-amber-900 to-amber-950 p-3 sm:p-4 text-white flex-1 flex flex-col">
          {/* Title */}
          <h3 className="font-bold text-sm sm:text-base mb-1.5 sm:mb-2 line-clamp-2 min-h-[2.5em]">
            {book.title}
          </h3>

          {/* Course Code & Manual Badge Row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-amber-200 font-medium text-xs sm:text-sm">
              {book.courseCode}
            </span>
            {book.hasManual && (
              <span className="px-1.5 py-0.5 bg-info/90 text-white text-[9px] sm:text-[10px] font-medium rounded">
                With Manual
              </span>
            )}
          </div>

          {/* Department */}
          <p className="text-amber-100/80 text-[10px] sm:text-xs line-clamp-1 mb-3">
            {book.department?.name || 'General'}
          </p>

          {/* Price */}
          <div className="mt-auto flex items-end justify-between">
            <p className="text-lg sm:text-xl font-bold text-white">
              {formatPrice(book.price)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}