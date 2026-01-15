'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Settings,
  Save,
  Plus,
  Trash2,
  Building2,
  GraduationCap,
  Calendar,
  ChevronRight,
  ChevronDown,
  Loader2
} from 'lucide-react';
import {
  useSystemSettings,
  useUpdateSystemSettings,
  useCreateFaculty,
  useDeleteFaculty,
  useCreateDepartment,
  useDeleteDepartment,
} from '@/hooks/useSettings';
import { useFaculties } from '@/hooks/useFaculties';
import {
  SkeletonCard,
  SkeletonSettingsHeader,
  SkeletonFacultyList
} from '@/components/shared/Skeleton';
import DeleteConfirmModal from '@/components/shared/DeleteConfirmModal';

export default function AdminSettingsPage() {
  const [expandedFaculty, setExpandedFaculty] = useState(null);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null,
    id: null,
    name: ''
  });

  // Forms
  const { register: registerSettings, handleSubmit: handleSettingsSubmit } = useForm();
  const { register: registerFaculty, handleSubmit: handleFacultySubmit, reset: resetFaculty } = useForm();
  const { register: registerDept, handleSubmit: handleDeptSubmit, reset: resetDept } = useForm();

  // TanStack Query hooks
  const { data: settings, isLoading: loadingSettings } = useSystemSettings();
  const { data: faculties = [], isLoading: loadingFaculties } = useFaculties();

  const updateSettingsMutation = useUpdateSystemSettings();
  const createFacultyMutation = useCreateFaculty();
  const deleteFacultyMutation = useDeleteFaculty();
  const createDepartmentMutation = useCreateDepartment();
  const deleteDepartmentMutation = useDeleteDepartment();

  const loading = loadingSettings || loadingFaculties;

  // Update System Settings
  const onUpdateSettings = async (data) => {
    updateSettingsMutation.mutate(data);
  };

  // Create Faculty
  const onCreateFaculty = async (data) => {
    createFacultyMutation.mutate(data, {
      onSuccess: () => resetFaculty(),
    });
  };

  // Open delete confirmation modal
  const openDeleteModal = (type, id, name) => {
    setDeleteModal({ isOpen: true, type, id, name });
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, type: null, id: null, name: '' });
  };

  // Confirm delete action
  const confirmDelete = async () => {
    const { type, id } = deleteModal;
    closeDeleteModal();

    if (type === 'faculty') {
      deleteFacultyMutation.mutate(id);
    } else if (type === 'department') {
      deleteDepartmentMutation.mutate(id);
    }
  };

  // Create Department
  const onCreateDepartment = async (data, facultyId) => {
    createDepartmentMutation.mutate({ ...data, facultyId }, {
      onSuccess: () => resetDept(),
    });
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <SkeletonSettingsHeader />
        <SkeletonCard lines={4} />
        <div className="space-y-4">
          <SkeletonCard lines={2} />
          <SkeletonFacultyList />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">System Settings</h1>
        </div>

        {/* GLOBAL SETTINGS CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">Academic Session & Semester</h2>
          </div>

          <form onSubmit={handleSettingsSubmit(onUpdateSettings)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Current Session</label>
                <input
                  {...registerSettings('currentSession')}
                  defaultValue={settings?.currentSession}
                  type="text"
                  placeholder="e.g. 2024/2025"
                  className="w-full px-3 sm:px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Current Semester</label>
                <select
                  {...registerSettings('currentSemester')}
                  defaultValue={settings?.currentSemester}
                  className="w-full px-3 sm:px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base"
                >
                  <option value="First Semester">First Semester</option>
                  <option value="Second Semester">Second Semester</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-1 flex items-end">
                <button
                  type="submit"
                  disabled={updateSettingsMutation.isPending}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateSettingsMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* FACULTIES & DEPARTMENTS CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Building2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">Faculties & Departments</h2>
          </div>

          {/* Add Faculty Form */}
          <form onSubmit={handleFacultySubmit(onCreateFaculty)} className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                {...registerFaculty('name', { required: true })}
                placeholder="Enter new faculty name..."
                className="flex-1 px-3 sm:px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base"
              />
              <button
                type="submit"
                disabled={createFacultyMutation.isPending}
                className="px-4 sm:px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createFacultyMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>{createFacultyMutation.isPending ? 'Adding...' : 'Add Faculty'}</span>
              </button>
            </div>
          </form>

          {/* Faculties List */}
          <div className="space-y-3 sm:space-y-4">
            {faculties.map((faculty) => (
              <div key={faculty.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                {/* Faculty Header */}
                <div
                  className="flex items-center justify-between p-3 sm:p-4 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
                  onClick={() => setExpandedFaculty(expandedFaculty === faculty.id ? null : faculty.id)}
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    {expandedFaculty === faculty.id ? (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-500 flex-shrink-0" />
                    )}
                    <span className="font-semibold text-neutral-900 text-sm sm:text-base truncate">{faculty.name}</span>
                    <span className="text-xs sm:text-sm text-neutral-500 flex-shrink-0">({faculty.departments?.length || 0})</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal('faculty', faculty.id, faculty.name);
                    }}
                    disabled={deleteFacultyMutation.isPending}
                    className="p-1.5 sm:p-2 text-error hover:bg-red-50 rounded-full transition-colors flex-shrink-0 ml-2 disabled:opacity-50"
                  >
                    {deleteFacultyMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Departments List (Expanded) */}
                {expandedFaculty === faculty.id && (
                  <div className="p-3 sm:p-4 bg-white border-t border-neutral-200 space-y-3 sm:space-y-4">
                    {/* Add Department Form */}
                    <form
                      onSubmit={handleDeptSubmit((data) => onCreateDepartment(data, faculty.id))}
                      className="flex flex-col sm:flex-row gap-2 sm:gap-3 pl-4 sm:pl-8"
                    >
                      <input
                        {...registerDept('name', { required: true })}
                        placeholder="Add department..."
                        className="flex-1 px-3 py-1.5 text-sm rounded-md border border-neutral-200 focus:ring-2 focus:ring-primary outline-none"
                      />
                      <button
                        type="submit"
                        disabled={createDepartmentMutation.isPending}
                        className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-sm rounded-md hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {createDepartmentMutation.isPending ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Plus className="w-3 h-3" />
                        )}
                        {createDepartmentMutation.isPending ? 'Adding...' : 'Add'}
                      </button>
                    </form>

                    {/* List */}
                    <div className="pl-4 sm:pl-8 space-y-2">
                      {faculty.departments?.map((dept) => (
                        <div key={dept.id} className="flex items-center justify-between group py-2 border-b border-neutral-100 last:border-0">
                          <div className="flex items-center gap-2 text-neutral-600 min-w-0 flex-1">
                            <GraduationCap className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                            <span className="text-sm truncate">{dept.name}</span>
                          </div>
                          <button
                            onClick={() => openDeleteModal('department', dept.id, dept.name)}
                            disabled={deleteDepartmentMutation.isPending}
                            className="p-1.5 text-error hover:bg-red-50 rounded transition-all flex-shrink-0 ml-2 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 disabled:opacity-50"
                          >
                            {deleteDepartmentMutation.isPending ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      ))}
                      {faculty.departments?.length === 0 && (
                        <p className="text-sm text-neutral-400 italic">No departments yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {faculties.length === 0 && (
              <div className="text-center py-6 sm:py-8 text-neutral-500 text-sm sm:text-base">
                No faculties added yet. Start by adding one above.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={deleteModal.name}
        itemType={deleteModal.type}
        warning={deleteModal.type === 'faculty' ? 'This will also delete all departments in this faculty.' : null}
        loading={deleteFacultyMutation.isPending || deleteDepartmentMutation.isPending}
      />
    </>
  );
}
