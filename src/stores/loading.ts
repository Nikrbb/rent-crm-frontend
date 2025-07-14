import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
    state: () => ({
        isLoading: false as boolean,
    }),
    actions: {
        startLoading() {
            this.isLoading = true;
        },
        stopLoading() {
            this.isLoading = false;
        },
        setLoading(value: boolean) {
            this.isLoading = value;
        },
    },
});
