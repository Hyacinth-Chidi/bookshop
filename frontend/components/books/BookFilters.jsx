'use client';

import { useFilterOptions } from '@/hooks/useBooks';
import Select from '@/components/shared/Select';
import { X } from 'lucide-react';

export default function BookFilters({ filters, onFilterChange, onClearFilters }) {
  // TanStack Query - fetch filter options
  const { data: options, isLoading } = useFilterOptions();

  const handleChange = (filterName, value) => {
    onFilterChange({ ...filters, [filterName]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Prepare options for Select components
  const facultyOptions = [
    { value: '', label: 'All Faculties' },
    ...(options?.faculties || []).map(f => ({ value: f.id, label: f.name }))
  ];

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    ...(options?.departments || []).map(d => ({ value: d.id, label: d.name }))
  ];

  const levelOptions = [
    { value: '', label: 'All Levels' },
    ...(options?.levels || []).map(l => ({ value: l, label: l }))
  ];

  const semesterOptions = [
    { value: '', label: 'All Semesters' },
    ...(options?.semesters || []).map(s => ({ value: s, label: s }))
  ];

  const sessionOptions = [
    { value: '', label: 'All Sessions' },
    ...(options?.sessions || []).map(s => ({ value: s, label: s }))
  ];

  const availabilityOptions = [
    { value: '', label: 'All Books' },
    { value: 'true', label: 'In Stock Only' },
    { value: 'false', label: 'Out of Stock' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-24 mb-2" />
            <div className="h-10 bg-neutral-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-primary hover:text-primary-dark transition-smooth flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Faculty Filter */}
      <Select
        label="Faculty"
        name="facultyId"
        value={filters.facultyId || ''}
        onChange={(e) => handleChange('facultyId', e.target.value)}
        options={facultyOptions}
        placeholder="All Faculties"
      />

      {/* Department Filter */}
      <Select
        label="Department"
        name="departmentId"
        value={filters.departmentId || ''}
        onChange={(e) => handleChange('departmentId', e.target.value)}
        options={departmentOptions}
        placeholder="All Departments"
      />

      {/* Level Filter */}
      <Select
        label="Level"
        name="level"
        value={filters.level || ''}
        onChange={(e) => handleChange('level', e.target.value)}
        options={levelOptions}
        placeholder="All Levels"
      />

      {/* Semester Filter */}
      <Select
        label="Semester"
        name="semester"
        value={filters.semester || ''}
        onChange={(e) => handleChange('semester', e.target.value)}
        options={semesterOptions}
        placeholder="All Semesters"
      />

      {/* Session Filter */}
      <Select
        label="Session"
        name="session"
        value={filters.session || ''}
        onChange={(e) => handleChange('session', e.target.value)}
        options={sessionOptions}
        placeholder="All Sessions"
      />

      {/* Availability Filter */}
      <Select
        label="Availability"
        name="inStock"
        value={filters.inStock || ''}
        onChange={(e) => handleChange('inStock', e.target.value)}
        options={availabilityOptions}
        placeholder="All Books"
      />

      {/* Has Manual */}
      <div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.hasManual === 'true'}
            onChange={(e) => handleChange('hasManual', e.target.checked ? 'true' : '')}
            className="w-4 h-4 text-primary border-neutral-300 rounded focus:ring-primary"
          />
          <span className="text-sm text-neutral-900">Has Manual</span>
        </label>
      </div>
    </div>
  );
}