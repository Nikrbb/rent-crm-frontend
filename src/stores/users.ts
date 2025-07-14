import { defineStore } from 'pinia';
import api from '@/api/_axios';

export interface User {
    id: number;
    name: string;
    // add other user fields as needed
}

export const useUsersStore = defineStore('users', {
    state: () => ({ users: [] as User[] }),
    actions: {
        async fetchUsers() {
            try {
                const res = await api.get('/users');
                this.users = res.data;
            } catch (error) {
                console.log(error);
            }
        },

        async addUser(name: string) {
            try {
                const res = await api.post('/users', { name });
                this.users.push(res.data);
            } catch (error) {
                console.log(error);
            }
        },
    },
});
