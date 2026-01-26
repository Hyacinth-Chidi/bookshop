
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Select from '@/components/shared/Select';
import Button from '@/components/shared/Button';
import { useBooks } from '@/hooks/useBooks';
import { usePrintOptions } from '@/hooks/usePrintOptions';
import PrintHeader from '@/components/print/PrintHeader';
import PrintStyles from '@/components/print/PrintStyles';
import SessionSemesterSelector from '@/components/print/SessionSemesterSelector';
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
  
  const {
    sessionOptions,
    semesterOptions,
    options,
    activeSession,
    activeSemester,
    selectedSession,
    selectedSemester,
    setSelectedSession,
    setSelectedSemester,
    optionsLoading,
  } = usePrintOptions();

  const queryParams = {
    facultyId: filters.facultyId,
    departmentId: filters.departmentId,
    level: filters.level,
    session: activeSession,
    semester: activeSemester,
    inStock: 'true',
    limit: 100, // Get all books for the selection
  };

  const shouldFetch = Boolean(showResults && filters.facultyId && filters.departmentId && filters.level);
  
  const { data: booksData, isLoading: booksLoading } = useBooks(
    queryParams,
    { enabled: shouldFetch }
  );
  const books = booksData?.books || [];

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

  const selectedFaculty = options?.faculties?.find(f => f.id === filters.facultyId);
  const selectedDepartment = options?.departments?.find(d => d.id === filters.departmentId);

  const totalPrice = books.reduce((sum, book) => sum + (book.price || 0), 0);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const newFilters = { ...prev, [name]: value };
      if (name === 'facultyId') {
        newFilters.departmentId = '';
      }
      return newFilters;
    });
    setShowResults(false);
  };

  const handleGenerate = () => {
    if (!filters.facultyId || !filters.departmentId || !filters.level) {
      alert('Please select Faculty, Department, and Level');
      return;
    }
    setShowResults(true);
  };

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
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Departmental Book List
            </h1>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Select
                label="Session"
                name="session"
                value={selectedSession || ''}
                onChange={(e) => {
                  setSelectedSession(e.target.value || null);
                  setShowResults(false);
                }}
                options={sessionOptions}
                disabled={optionsLoading}
              />
              <Select
                label="Semester"
                name="semester"
                value={selectedSemester || ''}
                onChange={(e) => {
                  setSelectedSemester(e.target.value || null);
                  setShowResults(false);
                }}
                options={semesterOptions}
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
                  
                  <div className="overflow-x-auto border border-neutral-200 rounded-lg">
                    <table className="w-full min-w-[700px] text-sm text-left">
                      <thead className="bg-neutral-900 text-white uppercase text-xs tracking-wider">
                        <tr>
                          <th className="py-3 px-4 font-bold w-12 text-center">S/N</th>
                          <th className="py-3 px-4 font-bold">Book Title</th>
                          <th className="py-3 px-4 font-bold w-32 text-center">Course Code</th>
                          <th className="py-3 px-4 font-bold">Lecturer/Author</th>
                          <th className="py-3 px-4 font-bold text-right w-32">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 bg-white">
                        {books.map((book, index) => (
                          <tr key={book.id} className="hover:bg-neutral-50 transition-colors">
                            <td className="py-3 px-4 text-center font-medium text-neutral-500">{index + 1}</td>
                            <td className="py-3 px-4 font-semibold text-neutral-800">{book.title}</td>
                            <td className="py-3 px-4 text-center">
                              <span className="inline-block bg-neutral-100 text-neutral-800 rounded px-2 py-1 text-xs font-mono font-bold border border-neutral-300">
                                {book.courseCode}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-neutral-600">{book.courseLecturer || '-'}</td>
                            <td className="py-3 px-4 text-right font-bold text-neutral-900">
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

      <div className="hidden print:block print:p-8" ref={printRef}>
        {/* Print Header */}
        <PrintHeader
          subtitle="Student Departmental TextBook List"
          session={activeSession}
          semester={activeSemester}
        />

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p><strong className="uppercase">Faculty:</strong> {selectedFaculty?.name || '-'}</p>
            <p><strong className="uppercase">Department:</strong> {selectedDepartment?.name || '-'}</p>
            <p><strong className="uppercase">Level:</strong> {filters.level || '-'}</p>
          </div>
          <div className="text-right">
            <p><strong className="uppercase">Session:</strong> {activeSession || '-'}</p>
            <p><strong className="uppercase">Semester:</strong> {activeSemester || '-'}</p>
            <p><strong className="uppercase">Date:</strong> {currentDate}</p>
          </div>
        </div>

        <table className="w-full text-sm border-collapse border-2 border-black mb-6">
          <thead>
            <tr className="border-b-2 border-black bg-gray-100 print:bg-gray-200">
              <th className="text-center py-2 px-2 w-12 border-r border-black font-bold">S/N</th>
              <th className="text-left py-2 px-2 border-r border-black font-bold">Book Title</th>
              <th className="text-center py-2 px-2 w-24 border-r border-black font-bold">Course Code</th>
              <th className="text-left py-2 px-2 border-r border-black font-bold whitespace-nowrap">Lecturer/Author</th>
              <th className="text-center py-2 px-2 w-28 font-bold border-black">Price</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={book.id} className="border-b border-black last:border-b-0 hover:bg-gray-50">
                <td className="py-1.5 px-2 text-center border-r border-black">{index + 1}</td>
                <td className="py-1.5 px-2 border-r border-black font-medium">{book.title}</td>
                <td className="py-1.5 px-2 text-center border-r border-black font-mono">{book.courseCode}</td>
                <td className="py-1.5 px-2 border-r border-black">{book.courseLecturer || '-'}</td>
                <td className="py-1.5 px-2 text-center font-bold">
                  {formatPrice(book.price)}
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

      <PrintStyles />

    </div>
  );
}
