<!-- src/components/Breadcrumbs.vue -->
<template>
    <Breadcrumb :model="breadcrumbItems" :home="homeItem" />
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useNavigationStore } from '@/stores/navigation';
import { ref, watchEffect } from 'vue';

const route = useRoute();
const router = useRouter();
const navigationStore = useNavigationStore();

const homeItem = {
    icon: 'pi pi-home',
    command: () => router.push('/'),
};

interface BreadcrumbItem {
    label: string;
    command?: () => void;
}

const breadcrumbItems = ref<BreadcrumbItem[]>([]);

watchEffect(async () => {
    const items = [];

    // 1. Previous route
    const prev = navigationStore.previousRoute;
    if (prev && prev.name !== route.name && prev.name !== 'home') {
        const label =
            typeof prev.meta?.breadcrumb === 'function'
                ? await prev.meta.breadcrumb(route)
                : prev.meta?.breadcrumb || prev.name;
        items.push({
            label,
            command: () => router.push(prev.path),
        });
    }

    // 2. Current matched route chain
    const matched = route.matched.filter((r) => r.meta?.breadcrumb);
    for (const r of matched) {
        const bc = r.meta.breadcrumb;
        if (typeof bc === 'function') {
            const result = await bc(route);
            if (Array.isArray(result)) {
                items.push(...result.map((l) => ({ label: l })));
            } else {
                items.push({ label: result });
            }
        } else {
            items.push({ label: bc });
        }
    }

    breadcrumbItems.value = items;
});
</script>
