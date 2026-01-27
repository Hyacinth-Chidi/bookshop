'use client';

import { useState, useMemo, Fragment } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/shared/Button';
import { useReportBooks } from '@/hooks/useBooks';
import { usePrintOptions } from '@/hooks/usePrintOptions';
import PrintHeader from '@/components/print/PrintHeader';
import PrintStyles from '@/components/print/PrintStyles';
import SessionSemesterSelector from '@/components/print/SessionSemesterSelector';
import { Printer, FileText, Loader2 } from 'lucide-react';

export default function ReportPage() {
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
    session: activeSession,
    semester: activeSemester,
  };

  const shouldFetch = Boolean(showResults && activeSession && activeSemester);
  
  const { data: reportData, isLoading: booksLoading } = useReportBooks(
    queryParams,
    { enabled: shouldFetch }
  );
  const books = reportData?.books || [];

  const groupedBooks = useMemo(() => {
    if (!books.length || !options) return [];

    const facultyMap = {};
    options.faculties?.forEach(f => {
      facultyMap[f.id] = { ...f, departments: {} };
    });

    const deptMap = {};
    options.departments?.forEach(d => {
      deptMap[d.id] = d;
    });

    books.forEach(book => {
      const facultyId = book.facultyId;
      const deptId = book.departmentId;
      const level = book.level;

      if (!facultyMap[facultyId]) return;
      
      if (!facultyMap[facultyId].departments[deptId]) {
        facultyMap[facultyId].departments[deptId] = {
          name: deptMap[deptId]?.name || 'Unknown Department',
          levels: {}
        };
      }

      if (!facultyMap[facultyId].departments[deptId].levels[level]) {
        facultyMap[facultyId].departments[deptId].levels[level] = [];
      }

      facultyMap[facultyId].departments[deptId].levels[level].push(book);
    });

    const result = Object.entries(facultyMap)
      .filter(([_, faculty]) => Object.keys(faculty.departments).length > 0)
      .map(([id, faculty]) => ({
        id,
        name: faculty.name,
        departments: Object.entries(faculty.departments)
          .map(([deptId, dept]) => ({
            id: deptId,
            name: dept.name,
            levels: Object.entries(dept.levels)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([level, levelBooks]) => ({
                level,
                books: levelBooks.sort((a, b) => a.title.localeCompare(b.title))
              }))
          }))
          .sort((a, b) => a.name.localeCompare(b.name))
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [books, options]);

  const handleGenerate = () => {
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
              List of Books and their Prices
            </h1>
            
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Select Session & Semester
            </h2>
            
            <SessionSemesterSelector
              sessionOptions={sessionOptions}
              semesterOptions={semesterOptions}
              selectedSession={selectedSession}
              selectedSemester={selectedSemester}
              onSessionChange={(value) => {
                setSelectedSession(value);
                setShowResults(false);
              }}
              onSemesterChange={(value) => {
                setSelectedSemester(value);
                setShowResults(false);
              }}
              disabled={optionsLoading}
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleGenerate}
                variant="primary"
                className="flex-1"
              >
                <FileText className="w-5 h-5 mr-2" />
                Generate Report
              </Button>
              
              {showResults && groupedBooks.length > 0 && (
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

          {showResults && (
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              {booksLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <span className="ml-3 text-neutral-500">Loading books...</span>
                </div>
              ) : groupedBooks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-500">
                    No books found for the selected session and semester.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-neutral-900">
                      Preview ({books.length} books across {groupedBooks.length} faculties)
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto pr-2">
                    {groupedBooks.map(faculty => (
                      <div key={faculty.id} className="bg-neutral-50 rounded-xl border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">
                        {/* Faculty Header */}
                        <div className="bg-neutral-900 px-4 py-3">
                          <h3 className="text-white font-bold text-sm uppercase tracking-wide truncate">
                            {faculty.name}
                          </h3>
                        </div>
                        
                        {/* Departments List */}
                        <div className="p-4 space-y-4">
                          {faculty.departments.map(dept => (
                            <div key={dept.id} className="border-b border-neutral-200 last:border-0 pb-3 last:pb-0">
                              <h4 className="font-semibold text-neutral-800 text-sm mb-2 flex items-center justify-between">
                                <span className="truncate pr-2">{dept.name}</span>
                              </h4>
                              
                              <div className="flex flex-wrap gap-2">
                                {dept.levels.map(l => (
                                  <span 
                                    key={l.level} 
                                    className="inline-flex items-center px-2 py-1 rounded bg-white border border-neutral-200 text-xs font-medium text-neutral-600"
                                  >
                                    <span className="text-primary font-bold mr-1">{l.books.length}</span>
                                    {l.level.replace(' Level', 'L')}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <div className="hidden print:block print:p-4" id="print-content">
        <PrintHeader
          subtitle="List Of Books And Their Prices"
          session={activeSession}
          semester={activeSemester}
        />

        {groupedBooks.map((faculty, facultyIndex) => (
          <div key={faculty.id} className={facultyIndex > 0 ? 'page-break-before' : ''}>
            <div className="bg-gray-200 p-2 mb-4 border-2 border-black">
              <h2 className="text-lg font-bold uppercase text-center">
                {faculty.name}
              </h2>
            </div>

            {faculty.departments.map(dept => (
              <div key={dept.id} className="mb-8 avoid-break">
                {/* Department Header */}
                <div className="bg-black text-white p-2 mb-0 border-2 border-black border-b-0 text-center">
                  <h3 className="text-lg font-bold uppercase tracking-wider">
                    {dept.name}
                  </h3>
                </div>

                {/* Unified Table for Department */}
                <table className="w-full text-sm border-collapse border-2 border-black">
                  <thead>
                    <tr className="border-b-2 border-black bg-gray-100 print:bg-gray-200">
                      <th className="text-center py-2 px-2 w-8 border-r border-black font-bold">S/N</th>
                      <th className="text-left py-2 px-2 border-r border-black font-bold">Book Title</th>
                      <th className="text-center py-2 px-2 w-24 border-r border-black font-bold">Course Code</th>
                      <th className="text-left py-2 px-2 border-r border-black font-bold whitespace-nowrap">Lect/Author</th>
                      <th className="text-center py-2 px-2 w-28 font-bold border-black">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dept.levels.map((levelData) => (
                      <Fragment key={levelData.level}>
                        {/* Level Section Heading */}
                        <tr key={`header-${levelData.level}`} className="bg-gray-200 border-y-2 border-black print:bg-gray-300">
                          <td colSpan="5" className="py-1 px-4 text-center font-bold uppercase tracking-wide text-sm">
                            {levelData.level}
                          </td>
                        </tr>
                        
                        {/* Books Rows */}
                        {levelData.books.map((book, index) => (
                          <tr key={book.id} className="border-b border-black last:border-b-0 hover:bg-gray-50">
                            <td className="py-1.5 px-2 text-center border-r border-black">{index + 1}</td>
                            <td className="py-1.5 px-2 border-r border-black font-medium">{book.title}</td>
                            <td className="py-1.5 px-2 text-center border-r border-black font-mono">{book.courseCode || '-'}</td>
                            <td className="py-1.5 px-2 border-r border-black">{book.courseLecturer || '-'}</td>
                            <td className="py-1.5 px-2 text-center font-bold">
                              ₦{Math.round(book.price).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="print:hidden">
        <Footer />
      </div>

      <PrintStyles />
    </div>
  );
}
