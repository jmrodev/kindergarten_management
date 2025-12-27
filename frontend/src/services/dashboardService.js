import api from '../utils/api';

const getStats = async () => {
    return await api.get('/api/dashboard/stats');
};

export default {
    getStats
};
