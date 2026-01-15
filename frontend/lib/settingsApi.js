import api from './api';

// ============================================
// SYSTEM SETTINGS API
// ============================================

export const getSystemSettings = async () => {
    return await api.get('/settings');
};

export const updateSystemSettings = async (data) => {
    return await api.put('/settings', data);
};

// ============================================
// FACULTY & DEPARTMENT API
// ============================================

export const getFaculties = async () => {
    return await api.get('/faculties');
};

export const createFaculty = async (data) => {
    return await api.post('/faculties', data);
};

export const deleteFaculty = async (id) => {
    return await api.delete(`/faculties/${id}`);
};

export const createDepartment = async (data) => {
    return await api.post('/faculties/departments', data);
};

export const deleteDepartment = async (id) => {
    return await api.delete(`/faculties/departments/${id}`);
};
