import { defineStore } from 'pinia';
import { createParkingSpot, fetchParkingSpots } from '@/api/parking';

export const useParkingStore = defineStore('parking', {
    state: () => ({
        spots: [],
    }),
    actions: {
        async getAll() {
            try {
                const response = await fetchParkingSpots();
                this.spots = response.data;
            } catch (error) {
                console.log(error);
            }
        },

        async create(payload: { houseId: number; number: string; locaion?: string }) {
            try {
                const response = await createParkingSpot(payload);
                this.spots = response.data;
            } catch (error) {
                console.log(error);
            }
        },
    },
});
