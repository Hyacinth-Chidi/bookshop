'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Search } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  // Don't show navbar on admin pages
  if (pathname?.startsWith('/admin')) return null;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Image
              src="/esut logo.png"
              alt="ESUT Logo"
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            />
            <span className="text-lg sm:text-xl font-bold text-neutral-900">
              ESUT Bookshop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-smooth ${isActive('/') ? 'text-primary' : 'text-neutral-700 hover:text-primary'}`}
            >
              Home
            </Link>
            <Link
              href="/books"
              className={`text-sm font-medium transition-smooth ${isActive('/books') ? 'text-primary' : 'text-neutral-700 hover:text-primary'}`}
            >
              Browse Books
            </Link>
           

            <Link
              href="/sales-template"
              className={`text-sm font-medium transition-smooth ${isActive('/sales-template') ? 'text-primary' : 'text-neutral-700 hover:text-primary'}`}
            >
              Sales Template
            </Link>

             <Link
              href="/about"
              className={`text-sm font-medium transition-smooth ${isActive('/about') ? 'text-primary' : 'text-neutral-700 hover:text-primary'}`}
            >
              About
            </Link>

            <Link
              href="/report"
              className={`text-sm font-medium transition-smooth ${isActive('/report') ? 'text-primary' : 'text-neutral-700 hover:text-primary'}`}
            >
              Full Book List
            </Link>

          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-smooth"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-neutral-900" />
            ) : (
              <Menu className="w-6 h-6 text-neutral-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-neutral-200">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${isActive('/') ? 'bg-primary text-white' : 'text-neutral-700 hover:bg-neutral-100'}`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/books"
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${isActive('/books') ? 'bg-primary text-white' : 'text-neutral-700 hover:bg-neutral-100'}`}
              onClick={() => setIsOpen(false)}
            >
              Browse Books
            </Link>

            <Link
              href="/sales-template"
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${isActive('/sales-template') ? 'bg-primary text-white' : 'text-neutral-700 hover:bg-neutral-100'}`}
              onClick={() => setIsOpen(false)}
            >
              Sales Template
            </Link>

            <Link
              href="/about"
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${isActive('/about') ? 'bg-primary text-white' : 'text-neutral-700 hover:bg-neutral-100'}`}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>

            <Link
              href="/report"
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${isActive('/report') ? 'bg-primary text-white' : 'text-neutral-700 hover:bg-neutral-100'}`}
              onClick={() => setIsOpen(false)}
            >
              Full Book List
            </Link>


          </div>
        </div>
      )}
    </nav>
  );
}