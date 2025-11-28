// frontend/src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

// Login
export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

// Logout
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Get current user from localStorage
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
};

// Get token
export const getToken = () => {
    return localStorage.getItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!getToken();
};

// Get user profile from API
export const getProfile = async () => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
    const token = getToken();
    const response = await axios.post(
        `${API_URL}/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

// Register new user (admin only)
export const register = async (userData) => {
    const token = getToken();
    const response = await axios.post(
        `${API_URL}/register`,
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export default {
    login,
    logout,
    getCurrentUser,
    getToken,
    isAuthenticated,
    getProfile,
    changePassword,
    register
};
