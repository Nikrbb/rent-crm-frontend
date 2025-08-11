import { defineStore } from 'pinia';
import api from '@/api/_axios';
import { login } from '@/api/auth';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
    }),
    actions: {
        setToken(newToken: string) {
            this.token = newToken;
            localStorage.setItem('token', newToken);
        },
        clearToken() {
            this.token = null;
            localStorage.removeItem('token');
        },
        async login(payload: { username: string; password: string }) {
            try {
                const req = await login(payload);
                this.setToken(req.data.token);
            } catch (error) {
                console.log(error);
            }
        },
    },
});
