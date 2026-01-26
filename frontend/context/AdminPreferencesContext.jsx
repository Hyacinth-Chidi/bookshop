'use client';

import { createContext, useContext, useState } from 'react';

const AdminPreferencesContext = createContext();

export function AdminPreferencesProvider({ children }) {
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  return (
    <AdminPreferencesContext.Provider value={{
      selectedSession,
      setSelectedSession,
      selectedSemester,
      setSelectedSemester,
      selectedFaculty,
      setSelectedFaculty,
      selectedDepartment,
      setSelectedDepartment,
      selectedLevel,
      setSelectedLevel
    }}>
      {children}
    </AdminPreferencesContext.Provider>
  );
}

export function useAdminPreferences() {
  return useContext(AdminPreferencesContext);
}
