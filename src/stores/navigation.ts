// src/stores/navigation.ts
import { defineStore } from 'pinia';

export const useNavigationStore = defineStore('navigation', {
    state: () => ({
        previousRoute: null as null | {
            name: string;
            path: string;
            meta?: Record<string, any>;
        },
    }),
    actions: {
        setPreviousRoute(route: { name: string; fullPath: string; meta?: Record<string, any> }) {
            this.previousRoute = {
                name: route.name,
                path: route.fullPath,
                meta: route.meta,
            };
        },
    },
});
