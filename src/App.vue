<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import ErrorPopup from '@/components/ErrorPopup.vue';
import Breadcrumbs from './components/Breadcrumbs.vue';
</script>

<template>
    <main class="main">
        <Breadcrumbs />
        <RouterView />
    </main>
</template>

<style scoped lang="scss">
.main {
    padding: 10px;
}
</style>
