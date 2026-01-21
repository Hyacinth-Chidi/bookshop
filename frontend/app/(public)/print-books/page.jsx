
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';
import { useFilterOptions, useBooks } from '@/hooks/useBooks';
import { useSystemSettings } from '@/hooks/useSettings';
import { formatPrice } from '@/lib/utils';
import { Printer, FileText, Loader2 } from 'lucide-react';

export default function PrintBooksPage() {
  const printRef = useRef(null);
  const [filters, setFilters] = useState({
    facultyId: '',
    departmentId: '',
    level: '',
  });
  const [showResults, setShowResults] = useState(false);

  // Fetch filter options
  const { data: options, isLoading: optionsLoading } = useFilterOptions();
  const { data: settings } = useSystemSettings();

  // Build query params for fetching books
  const queryParams = {
    facultyId: filters.facultyId,
    departmentId: filters.departmentId,
    level: filters.level,
    session: settings?.currentSession || '',
    semester: settings?.currentSemester || '',
    inStock: 'true',
    limit: 100, // Get all books for the selection
  };

  // Only fetch when showResults is true AND all filters are selected
  const shouldFetch = Boolean(showResults && filters.facultyId && filters.departmentId && filters.level);
  
  // Fetch books when filters are applied
  const { data: booksData, isLoading: booksLoading } = useBooks(
    queryParams,
    { enabled: shouldFetch }
  );
  const books = booksData?.books || [];

  // Filter options
  const facultyOptions = [
    { value: '', label: 'Select Faculty' },
    ...(options?.faculties || []).map(f => ({ value: f.id, label: f.name }))
  ];

  const departmentOptions = [
    { value: '', label: 'Select Department' },
    ...(options?.departments || [])
      .filter(d => !filters.facultyId || d.facultyId === filters.facultyId)
      .map(d => ({ value: d.id, label: d.name }))
  ];

  const levelOptions = [
    { value: '', label: 'Select Level' },
    ...(options?.levels || []).map(l => ({ value: l, label: l }))
  ];

  // Get selected names for display
  const selectedFaculty = options?.faculties?.find(f => f.id === filters.facultyId);
  const selectedDepartment = options?.departments?.find(d => d.id === filters.departmentId);

  // Calculate total price
  const totalPrice = books.reduce((sum, book) => sum + (book.price || 0), 0);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const newFilters = { ...prev, [name]: value };
      // Reset department when faculty changes
      if (name === 'facultyId') {
        newFilters.departmentId = '';
      }
      return newFilters;
    });
    setShowResults(false);
  };

  // Generate book list
  const handleGenerate = () => {
    if (!filters.facultyId || !filters.departmentId || !filters.level) {
      alert('Please select Faculty, Department, and Level');
      return;
    }
    setShowResults(true);
  };

  // Print the book list
  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-NG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen flex flex-col">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 py-8 print:hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Departmental Book List
            </h1>
            <p className="text-neutral-500 max-w-md mx-auto">
              Access the approved schedule of required textbooks for your department and level for the current academic session.
            </p>
          </div>


          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Academic Selection
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Select
                label="Faculty"
                name="facultyId"
                value={filters.facultyId}
                onChange={handleFilterChange}
                options={facultyOptions}
                disabled={optionsLoading}
              />
              <Select
                label="Department"
                name="departmentId"
                value={filters.departmentId}
                onChange={handleFilterChange}
                options={departmentOptions}
                disabled={!filters.facultyId || optionsLoading}
              />
              <Select
                label="Level"
                name="level"
                value={filters.level}
                onChange={handleFilterChange}
                options={levelOptions}
                disabled={optionsLoading}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleGenerate}
                variant="primary"
                className="flex-1"
                disabled={!filters.facultyId || !filters.departmentId || !filters.level}
              >
                <FileText className="w-5 h-5 mr-2" />
                Generate Book List
              </Button>
              
              {showResults && books.length > 0 && (
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="flex-1"
                >
                  <Printer className="w-5 h-5 mr-2" />
                  Print / Save as PDF
                </Button>
              )}
            </div>
          </div>

          {/* Results Preview */}
          {showResults && (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              {booksLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <span className="ml-3 text-neutral-500">Loading books...</span>
                </div>
              ) : books.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-500">
                    No books found for the selected criteria.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-neutral-900">
                      Preview ({books.length} books)
                    </h2>
                    <p className="text-lg font-bold text-primary">
                      Total: {formatPrice(totalPrice)}
                    </p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-neutral-200">
                          <th className="text-left py-3 px-2 font-semibold text-neutral-700">S/N</th>
                          <th className="text-left py-3 px-2 font-semibold text-neutral-700">Title</th>
                          <th className="text-left py-3 px-2 font-semibold text-neutral-700">Course Code</th>
                          <th className="text-left py-3 px-2 font-semibold text-neutral-700">Lecturer</th>
                          <th className="text-right py-3 px-2 font-semibold text-neutral-700">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {books.map((book, index) => (
                          <tr key={book.id} className="border-b border-neutral-100">
                            <td className="py-3 px-2 text-neutral-600">{index + 1}</td>
                            <td className="py-3 px-2 text-neutral-900 font-medium">{book.title}</td>
                            <td className="py-3 px-2 text-neutral-600">{book.courseCode}</td>
                            <td className="py-3 px-2 text-neutral-600">{book.courseLecturer || '-'}</td>
                            <td className="py-3 px-2 text-neutral-900 font-semibold text-right">
                              {formatPrice(book.price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Print Layout - Only visible when printing */}
      <div className="hidden print:block print:p-8" ref={printRef}>
        {/* Print Header */}
        <div className="border-b-2 border-neutral-900 pb-4 mb-6">
          <div className="flex items-center gap-6">
            <Image
              src="/esut logo.png"
              alt="ESUT Logo"
              width={80}
              height={80}
              className="object-contain grayscale"
              unoptimized
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-neutral-900 uppercase tracking-wide mb-1">
                ENUGU STATE UNIVERSITY OF SCIENCE AND TECHNOLOGY
              </h1>
              <h2 className="text-xl font-bold text-neutral-800 uppercase">
                Student Departmental TextBook List
              </h2>
            </div>
          </div>
        </div>

        {/* Print Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p><strong className="uppercase">Faculty:</strong> {selectedFaculty?.name || '-'}</p>
            <p><strong className="uppercase">Department:</strong> {selectedDepartment?.name || '-'}</p>
            <p><strong className="uppercase">Level:</strong> {filters.level || '-'}</p>
          </div>
          <div className="text-right">
            <p><strong className="uppercase">Session:</strong> {settings?.currentSession || '-'}</p>
            <p><strong className="uppercase">Semester:</strong> {settings?.currentSemester || '-'}</p>
            <p><strong className="uppercase">Date:</strong> {currentDate}</p>
          </div>
        </div>

        {/* Print Table */}
        <table className="w-full text-sm border-collapse border border-neutral-400 mb-6">
          <thead>
            <tr className="bg-neutral-100">
              <th className="border border-neutral-400 py-2 px-3 text-left w-12">S/N</th>
              <th className="border border-neutral-400 py-2 px-3 text-left">Book Title</th>
              <th className="border border-neutral-400 py-2 px-3 text-left w-28">Course Code</th>
              <th className="border border-neutral-400 py-2 px-3 text-left">Lecturer</th>
              <th className="border border-neutral-400 py-2 px-3 text-right w-24">Price (₦)</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={book.id}>
                <td className="border border-neutral-400 py-2 px-3">{index + 1}</td>
                <td className="border border-neutral-400 py-2 px-3">{book.title}</td>
                <td className="border border-neutral-400 py-2 px-3">{book.courseCode}</td>
                <td className="border border-neutral-400 py-2 px-3">{book.courseLecturer || '-'}</td>
                <td className="border border-neutral-400 py-2 px-3 text-right">
                  {formatPrice(book.price).replace('₦', '')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        
        <div className="flex justify-end">
          <div>
            <p className="text-lg font-bold">
              TOTAL: {formatPrice(totalPrice)}
            </p>
          </div>
        </div>

       
        <div className="mt-8 pt-4 border-t border-neutral-300 text-center text-xs text-neutral-500">
          <p>Generated from ESUT Bookshop • {currentDate}</p>
        </div>
      </div>

      
      <div className="print:hidden">
        <Footer />

      </div>

    </div>
  );
}
