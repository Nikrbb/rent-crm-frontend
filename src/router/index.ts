import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import HomeView from '@/views/Houses/HousesView.vue';
import CreateView from '@/views/CreateView.vue';
import LoginView from '@/views/LoginView.vue';
import { useNavigationStore } from '@/stores/navigation';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: LoginView,
    },
    {
        path: '/houses',
        name: 'houses',
        component: HomeView,
        meta: { requiresAuth: true },
    },
    {
        path: '/create',
        name: 'create',
        component: CreateView,
        meta: { requiresAuth: true },
    },
    {
        path: '/house/:id',
        name: 'house-parking',
        meta: { requiresAuth: true },
        component: () => import('../views/HouseParkings/HouseParkingsView.vue'),
    },
    {
        path: '/house/:id/reservations',
        name: 'house-parking-reservations',
        meta: { requiresAuth: true },
        component: () => import('../views/ReservationsView.vue'),
    },
    {
        path: '/parking/:id',
        name: 'parking',
        meta: { requiresAuth: true },
        component: () => import('../views/ParkingView.vue'),
    },
    {
        path: '/reservations/',
        name: 'reservations',
        meta: { requiresAuth: true },
        component: () => import('../views/ReservationsView.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.token) {
        return next('/login');
    }
    if (to.path === '/login' && authStore.token) {
        return next('/houses');
    }
    const navigationStore = useNavigationStore();

    if (typeof from.name === 'string') {
        navigationStore.setPreviousRoute({
            name: from.name,
            fullPath: from.fullPath,
            meta: from.meta,
        });
    }
    next();
});

export default router;
