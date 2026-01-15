'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Don't show footer on admin pages
  if (pathname?.startsWith('/admin')) return null;

  return (
    // Footer Component
    <footer className="bg-neutral-900 text-neutral-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand - Full width on mobile */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/esut logo.png"
                alt="ESUT Logo"
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
              <span className="text-lg sm:text-xl font-bold">ESUT Bookshop</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xs">
              Your trusted source for academic books and materials at Enugu State University of Science and Technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link href="/" className="text-xs sm:text-sm text-neutral-300 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/books" className="text-xs sm:text-sm text-neutral-300 hover:text-primary transition-colors">
                  Browse Books
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-xs sm:text-sm text-neutral-300 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-white">Contact Us</h3>
            <ul className="space-y-2.5 sm:space-y-3">
              <li className="flex items-start gap-2 text-xs sm:text-sm text-neutral-300">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                <span className="leading-tight">ESUT, Enugu</span>
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-neutral-300">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>+234 XXX XXX XXXX</span>
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-neutral-300">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="truncate">bookshop@esut.edu.ng</span>
              </li>
            </ul>
          </div>

          {/* Admin Access */}
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/admin/login"
              className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-white"
            >
              Administration
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-700/50 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <p className="text-xs sm:text-sm text-neutral-400 text-center">
            © {new Date().getFullYear()} ESUT Bookshop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}