import { defineStore } from 'pinia';
import api from '@/api/_axios';

export const useApartmentsStore = defineStore('apartments', {
    state: () => ({
        apartments: [],
    }),
    actions: {
        async createApartment(payload: { houseId: number; number: string; note?: string }) {
            try {
                const response = await api.post('/apartments', payload);
                this.apartments = response.data;
            } catch (error) {
                console.log(error);
            }
        },

        async getAll() {
            try {
                const response = await api.get('/apartments');
                this.apartments = response.data;
            } catch (error) {
                console.log(error);
            }
        },
    },
});
