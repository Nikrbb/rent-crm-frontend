import { defineStore } from 'pinia';
import type { House } from '@/interfaces/House';
import { createHouse, getHouses } from '@/api/houses';

interface HouseStore {
    houses: House[];
}

export const useHouseStore = defineStore('houses', {
    state: () =>
        <HouseStore>{
            houses: [],
        },
    actions: {
        async create(payload: { name: string; address: string; photo_url?: string }) {
            try {
                await createHouse(payload);
            } catch (error) {
                console.log(error);
            }
        },

        async getAll() {
            try {
                const response = await getHouses();
                this.houses = response.data;
            } catch (error) {
                console.log(error);
            }
        },
    },
});
