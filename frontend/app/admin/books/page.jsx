'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useBooks, useDeleteBook, useFilterOptions } from '@/hooks/useBooks';
import { useFaculties } from '@/hooks/useFaculties';
import { useSystemSettings } from '@/hooks/useSettings';
import { useAdminPreferences } from '@/context/AdminPreferencesContext';
import Button from '@/components/shared/Button';
import Select from '@/components/shared/Select';
import DeleteConfirmModal from '@/components/shared/DeleteConfirmModal';
import { formatPrice } from '@/lib/utils';
import { Plus, Edit, Trash2, Search, MoreVertical, Loader2, Filter } from 'lucide-react';

// Actions Dropdown Component - Fixed position overlay
function ActionsDropdown({ book, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.right - 144,
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-neutral-600" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setIsOpen(false)}
          />
          <div
            ref={dropdownRef}
            className="fixed w-36 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-[101]"
            style={{ top: position.top, left: Math.max(8, position.left) }}
          >
            <Link
              href={`/admin/books/edit/${book.id}`}
              className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={() => {
                setIsOpen(false);
                onDelete(book);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-red-50 transition-colors w-full text-left"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default function AdminBooksPage() {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, book: null });
  const [showFilters, setShowFilters] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  // Use global preferences state
  const { 
    selectedSession, setSelectedSession, 
    selectedSemester, setSelectedSemester,
    selectedFaculty, setSelectedFaculty,
    selectedDepartment, setSelectedDepartment,
    selectedLevel, setSelectedLevel
  } = useAdminPreferences();

  // Derived state for available departments
  const availableDepartments = selectedFaculty 
    ? faculties.find(f => f.id === selectedFaculty)?.departments || [] 
    : [];
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  // TanStack Query hooks
  const { data: faculties = [] } = useFaculties();
  const { data: filterOptions } = useFilterOptions();
  const { data: settings } = useSystemSettings();
  const { data, isLoading, isFetching } = useBooks({
    page,
    limit,
    search: debouncedSearch,
    facultyId: selectedFaculty,
    departmentId: selectedDepartment,
    level: selectedLevel || undefined,
    session: selectedSession || settings?.currentSession,
    semester: selectedSemester || settings?.currentSemester,
  });
  const books = data?.books || [];
  const pagination = data?.pagination || { page: 1, limit: 50, totalPages: 1, total: 0 };

  const deleteBookMutation = useDeleteBook();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleFacultyChange = (e) => {
    const facultyId = e.target.value;
    setSelectedFaculty(facultyId);
    setSelectedDepartment('');
    setPage(1); // Reset to page 1 on filter
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, book: null });
  };

  const handleDelete = async () => {
    deleteBookMutation.mutate(deleteModal.book.id, {
      onSuccess: () => {
        closeDeleteModal();
      },
    });
  };

  const facultyOptions = [
    { value: '', label: 'All Faculties' },
    ...faculties.map(f => ({ value: f.id, label: f.name }))
  ];

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    ...availableDepartments.map(d => ({ value: d.id, label: d.name }))
  ];

  // Level options from filter options
  const levelOptions = [
    { value: '', label: 'All Levels' },
    ...(filterOptions?.levels || []).map(l => ({ value: l, label: l }))
  ];

  // Session options
  const sessionOptions = [
    { value: '', label: `Current (${settings?.currentSession || '...'})` },
    ...(filterOptions?.sessions || [])
      .filter(s => s !== settings?.currentSession)
      .map(s => ({ value: s, label: s }))
  ];

  // Semester options (static)
  const semesterOptions = [
    { value: '', label: `Current (${settings?.currentSemester || '...'})` },
    { value: 'First Semester', label: 'First Semester' },
    { value: 'Second Semester', label: 'Second Semester' },
  ].filter((opt, index) => {
    if (index === 0) return true;
    return opt.value !== settings?.currentSemester;
  });

  return (
    <div className="h-[calc(100vh-64px)] lg:h-screen flex flex-col p-2 sm:p-3 pb-1 sm:pb-2 overflow-hidden">
      {/* Unified Header & Filters Card */}
      <div className="bg-white p-3 rounded-lg shadow-sm mb-3">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">Manage Books</h1>
            {isFetching && !isLoading && <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors border lg:hidden ${
                showFilters || searchQuery || selectedFaculty || selectedLevel || selectedSession
                  ? 'bg-primary/5 border-primary/20 text-primary'
                  : 'hover:bg-neutral-50 border-neutral-200 text-neutral-600'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
            <Link href="/admin/books/create">
              <Button variant="primary" className="text-sm py-2 px-3">
                <Plus className="w-4 h-4 mr-1" />
                Add Book
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 items-end transition-all ${
          showFilters ? 'block' : 'hidden lg:grid'
        }`}>
        <div className="col-span-2 md:col-span-3 lg:col-span-1">
          <label className="block text-xs font-medium text-neutral-500 mb-1">Search</label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Title/Code..."
              className="w-full pl-7 pr-2 py-1.5 text-xs sm:text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-8 sm:h-9"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Faculty</label>
          <Select
            name="faculty"
            value={selectedFaculty}
            onChange={handleFacultyChange}
            options={facultyOptions}
            placeholder="All"
            className="text-xs sm:text-sm py-1 h-8 sm:h-9"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Department</label>
          <Select
            name="department"
            value={selectedDepartment}
            onChange={(e) => { setSelectedDepartment(e.target.value); setPage(1); }}
            options={departmentOptions}
            placeholder="All"
            disabled={!selectedFaculty}
            className="text-xs sm:text-sm py-1 h-8 sm:h-9"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Level</label>
          <Select
            name="level"
            value={selectedLevel}
            onChange={(e) => { setSelectedLevel(e.target.value); setPage(1); }}
            options={levelOptions}
            placeholder="All"
            className="text-xs sm:text-sm py-1 h-8 sm:h-9"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Session</label>
          <Select
            name="session"
            value={selectedSession}
            onChange={(e) => { setSelectedSession(e.target.value); setPage(1); }}
            options={sessionOptions}
            placeholder="Current"
            className="text-xs sm:text-sm py-1 h-8 sm:h-9"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Semester</label>
          <Select
            name="semester"
            value={selectedSemester}
            onChange={(e) => { setSelectedSemester(e.target.value); setPage(1); }}
            options={semesterOptions}
            placeholder="Current"
            className="text-xs sm:text-sm py-1 h-8 sm:h-9"
          />
        </div>
      </div>
      </div>

      {/* Table Container - Flex Grow with Internal Scroll */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden flex flex-col min-h-0">
        <div className="overflow-auto flex-1 overscroll-contain">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-3 sm:px-4 py-2.5 text-left text-xs sm:text-sm font-semibold text-neutral-700 w-12 bg-neutral-50 sticky top-0 z-10">S/N</th>
                <th className="px-3 sm:px-4 py-2.5 text-left text-xs sm:text-sm font-semibold text-neutral-700 bg-neutral-50 sticky top-0 z-10">Book</th>
                <th className="px-3 sm:px-4 py-2.5 text-left text-xs sm:text-sm font-semibold text-neutral-700 hidden sm:table-cell">Course</th>
                <th className="px-3 sm:px-4 py-2.5 text-left text-xs sm:text-sm font-semibold text-neutral-700 hidden md:table-cell">Department</th>
                <th className="px-3 sm:px-4 py-2.5 text-left text-xs sm:text-sm font-semibold text-neutral-700">Price</th>
                <th className="px-3 sm:px-4 py-2.5 text-left text-xs sm:text-sm font-semibold text-neutral-700 hidden sm:table-cell">Qty</th>
                <th className="px-3 sm:px-4 py-2.5 text-left text-xs sm:text-sm font-semibold text-neutral-700 hidden sm:table-cell">Stock</th>
                <th className="px-3 sm:px-4 py-2.5 text-right text-xs sm:text-sm font-semibold text-neutral-700 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-6 text-center text-neutral-500 text-sm">
                    Loading books...
                  </td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-6 text-center text-neutral-500 text-sm">
                    No books found
                  </td>
                </tr>
              ) : (
                books.map((book, index) => (
                  <tr key={book.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-3 sm:px-4 py-3 text-sm text-neutral-500 font-mono">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="font-medium text-neutral-900 text-sm whitespace-normal">{book.title}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">{book.level}</div>
                      <div className="text-xs text-neutral-400 sm:hidden mt-0.5">{book.courseCode}</div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-sm text-neutral-700 hidden sm:table-cell whitespace-nowrap">{book.courseCode}</td>
                    <td className="px-3 sm:px-4 py-3 text-sm text-neutral-700 hidden md:table-cell">
                      <span className="block max-w-[180px] xl:max-w-none truncate" title={book.department ? book.department.name : ''}>
                        {book.department ? book.department.name : '-'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-sm font-medium text-neutral-900 whitespace-nowrap">
                      {formatPrice(book.price)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-sm text-neutral-700 hidden sm:table-cell">
                      {book.quantity}
                    </td>
                    <td className="px-3 sm:px-4 py-3 hidden sm:table-cell whitespace-nowrap">
                      {book.quantity > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-error/10 text-error border border-error/20">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right">
                      <ActionsDropdown
                        book={book}
                        onDelete={(book) => setDeleteModal({ isOpen: true, book })}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination - Separate Sticky Footer */}
      {!isLoading && pagination.total > 0 && (
        <div className="flex items-center justify-between gap-2 px-2 py-1.5 bg-white border border-neutral-200 rounded-lg shadow-sm text-xs shrink-0 mt-2">
          <div className="text-neutral-600">
            <span className="font-medium">{Math.min((page - 1) * limit + 1, pagination.total)}</span>-
            <span className="font-medium">{Math.min(page * limit, pagination.total)}</span> of{' '}
            <span className="font-medium">{pagination.total}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm font-medium rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(pagination.totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === pagination.totalPages ||
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                        page === pageNum
                          ? 'bg-primary text-white border border-primary'
                          : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (
                  (pageNum === page - 2 && pageNum > 2) ||
                  (pageNum === page + 2 && pageNum < pagination.totalPages - 1)
                ) {
                  return <span key={pageNum} className="px-1 text-neutral-400">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="px-3 py-1.5 text-sm font-medium rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        itemName={deleteModal.book?.title}
        itemType="book"
        warning="This action cannot be undone."
        loading={deleteBookMutation.isPending}
      />
    </div>
  );
}