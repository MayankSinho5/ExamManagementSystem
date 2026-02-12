import axios from 'axios';

const API = axios.create({
    baseURL: window.location.hostname === 'localhost'
        ? 'http://localhost:5000/api'
        : '/api',
});

// Add token to headers if it exists
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers['x-auth-token'] = token;
    }
    return req;
});

export default API;
