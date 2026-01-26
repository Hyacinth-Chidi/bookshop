/**
 * ============================================
 * PRINT OPTIONS HOOK
 * ============================================
 * Shared hook for session/semester selection with admin defaults
 */

import { useState } from 'react';
import { useFilterOptions } from '@/hooks/useBooks';
import { useSystemSettings } from '@/hooks/useSettings';

export function usePrintOptions() {
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);

  const { data: options, isLoading: optionsLoading } = useFilterOptions();
  const { data: settings } = useSystemSettings();

  // Active values (selected or default from settings)
  const activeSession = selectedSession || settings?.currentSession || '';
  const activeSemester = selectedSemester || settings?.currentSemester || '';

  // Session options from database
  const sessionOptions = [
    { value: '', label: `Current (${settings?.currentSession || 'Loading...'})` },
    ...(options?.sessions || [])
      .filter(s => s !== settings?.currentSession)
      .map(s => ({ value: s, label: s }))
  ];

  // Semester options (static)
  const semesterOptions = [
    { value: '', label: `Current (${settings?.currentSemester || 'Loading...'})` },
    { value: 'First Semester', label: 'First Semester' },
    { value: 'Second Semester', label: 'Second Semester' },
  ].filter((opt, index) => {
    if (index === 0) return true;
    return opt.value !== settings?.currentSemester;
  });

  return {
    // Options for dropdowns
    sessionOptions,
    semesterOptions,
    options, // Filter options (faculties, departments, levels)
    
    // Active values
    activeSession,
    activeSemester,
    
    // Setters
    setSelectedSession,
    setSelectedSemester,
    selectedSession,
    selectedSemester,
    
    // Loading state
    optionsLoading,
    settings,
  };
}
