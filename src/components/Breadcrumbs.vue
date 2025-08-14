<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const backItem = {
    icon: 'pi pi-angle-left',
    command: () => router.back(),
};

const homeItem = {
    icon: 'pi pi-home',
    command: () => router.push('/houses'),
};
</script>

<template>
    <Breadcrumb :model="[backItem, homeItem]">
        <template v-slot:separator> <span /></template>
    </Breadcrumb>
</template>
