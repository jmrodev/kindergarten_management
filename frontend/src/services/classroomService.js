import api from '../utils/api';

const classroomService = {
    getAllClassrooms: () => api.get('/classrooms'),
    getClassroomById: (id) => api.get(`/classrooms/${id}`),
    createClassroom: (classroomData) => api.post('/classrooms', classroomData),
    updateClassroom: (id, classroomData) => api.put(`/classrooms/${id}`, classroomData),
    deleteClassroom: (id) => api.delete(`/classrooms/${id}`)
};

export default classroomService;