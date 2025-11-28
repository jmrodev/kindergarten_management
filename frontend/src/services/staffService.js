import api from '../utils/api';

const staffService = {
    getAllStaff: () => api.get('/staff'),
    getStaffById: (id) => api.get(`/staff/${id}`),
    createStaff: (staffData) => api.post('/staff', staffData),
    updateStaff: (id, staffData) => api.put(`/staff/${id}`, staffData),
    deleteStaff: (id) => api.delete(`/staff/${id}`),
    getRoles: () => api.get('/staff/roles')
};

export default staffService;
