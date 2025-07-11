import api from './_axios';

export function login(payload: { username: string; password: string }) {
    return api.post('/auth/login', payload);
}
