'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { Book, Clock, MapPin, Phone, Mail } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 py-8 sm:py-10 lg:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full mb-4 shadow-md p-2">
              <Image
                src="/esut logo.png"
                alt="ESUT Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-2 sm:mb-4">
              About ESUT Bookshop
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-neutral-500 px-4">
              Your trusted source for academic materials
            </p>
          </div>

          {/* Mission */}
          <div className="bg-card rounded-lg p-5 sm:p-6 lg:p-8 mb-6 sm:mb-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3 sm:mb-4">
              Our Mission
            </h2>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-3 sm:mb-4">
              ESUT Bookshop is dedicated to providing students of Enugu State University of Science
              and Technology with easy access to the academic books and materials they need for their studies.
            </p>
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
              We understand the frustration of visiting the bookshop only to find that the book you need
              is out of stock. That's why we created this online platform - to help you check book
              availability before making the trip to campus.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-card rounded-lg p-4 sm:p-6 shadow-sm">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Book className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1 sm:mb-2 text-sm sm:text-base">
                    Wide Selection
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-700">
                    Access to textbooks across all faculties and departments
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 sm:p-6 shadow-sm">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1 sm:mb-2 text-sm sm:text-base">
                    Real-Time Updates
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-700">
                    Check stock availability before visiting the bookshop
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-lg p-5 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6">Contact Us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base mb-0.5 sm:mb-1">Location</p>
                  <p className="text-xs sm:text-sm text-neutral-100">
                    Enugu State University of Science and Technology, Agbani Enugu
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base mb-0.5 sm:mb-1">Phone</p>
                  <p className="text-xs sm:text-sm text-neutral-100">+234 XXX XXX XXXX</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base mb-0.5 sm:mb-1">Email</p>
                  <p className="text-xs sm:text-sm text-neutral-100">bookshop@esut.edu.ng</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base mb-0.5 sm:mb-1">Opening Hours</p>
                  <p className="text-xs sm:text-sm text-neutral-100">
                    Mon-Fri: 10AM - 2:30PM<br />
                  </p>
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