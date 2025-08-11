// src/api.js
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { useErrorStore } from '@/stores/error';
import { keysToCamelCase } from '@/utilities/toCamelCase';
import router from '../router';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // withCredentials: true,
    timeout: 5000,
    transformResponse: [
        ...(Array.isArray(axios.defaults.transformResponse)
            ? axios.defaults.transformResponse
            : axios.defaults.transformResponse
              ? [axios.defaults.transformResponse]
              : []),
        (data) => {
            try {
                const parsed = typeof data === 'string' ? JSON.parse(data) : data;
                return keysToCamelCase(parsed);
            } catch {
                return data;
            }
        },
    ],
});

api.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorStore = useErrorStore();
        const authStore = useAuthStore();

        if (error.response.status === 403) {
            authStore.clearToken();
            router.push('/login');
        }

        const message =
            error?.response?.data?.errors?.join(', ') || error.response?.data?.message || 'Произошла ошибка';

        errorStore.showError(message);
        return Promise.reject(error);
    },
);

export default api;
