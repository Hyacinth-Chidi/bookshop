'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useBooks, useDeleteBook } from '@/hooks/useBooks';
import { useFaculties } from '@/hooks/useFaculties';
import Button from '@/components/shared/Button';
import Select from '@/components/shared/Select';
import DeleteConfirmModal from '@/components/shared/DeleteConfirmModal';
import { formatPrice } from '@/lib/utils';
import { Plus, Edit, Trash2, Search, MoreVertical } from 'lucide-react';

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

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [availableDepartments, setAvailableDepartments] = useState([]);

  // TanStack Query hooks
  const { data: faculties = [] } = useFaculties();
  const { data, isLoading } = useBooks({
    limit: 100,
    search: debouncedSearch,
    facultyId: selectedFaculty,
    departmentId: selectedDepartment,
  });
  const books = data?.books || [];

  const deleteBookMutation = useDeleteBook();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleFacultyChange = (e) => {
    const facultyId = e.target.value;
    setSelectedFaculty(facultyId);
    setSelectedDepartment('');
    const faculty = faculties.find(f => f.id === facultyId);
    setAvailableDepartments(faculty?.departments || []);
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

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Manage Books</h1>
        <Link href="/admin/books/create">
          <Button variant="primary" className="w-full sm:w-auto">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Add New Book
          </Button>
        </Link>
      </div>

      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm mb-4 sm:mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or course code..."
            className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Select
          name="faculty"
          value={selectedFaculty}
          onChange={handleFacultyChange}
          options={facultyOptions}
          placeholder="All Faculties"
        />
        <Select
          name="department"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          options={departmentOptions}
          placeholder="All Departments"
          disabled={!selectedFaculty}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-3 sm:px-4 py-2.5 text-left text-xs sm:text-sm font-semibold text-neutral-700">Book</th>
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
                  <td colSpan="7" className="px-4 py-6 text-center text-neutral-500 text-sm">
                    Loading books...
                  </td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-neutral-500 text-sm">
                    No books found
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id} className="hover:bg-neutral-50 transition-colors">
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