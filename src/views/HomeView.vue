<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useHouseStore } from '@/stores/houses';
const router = useRouter();
const housesStore = useHouseStore();

onMounted(() => {
    if (housesStore.houses.length === 0) {
        housesStore.getAll();
    }
});

const chooseHouse = (houseId: string) => {
    router.push({ name: 'house', params: { id: houseId } });
};
</script>

<template>
    <!-- <Breadcrumb :home="home" :model="items" /> -->
    <div class="home-view">
        <h1 class="text-2xl mb-5">Выберите дом</h1>

        <ul>
            <li
                class="m-5 py-2 border rounded-md border-gray-600"
                v-for="house in housesStore.houses"
                v-bind:key="house.id"
                @click="chooseHouse(house.id)"
            >
                {{ house.name }}
            </li>
        </ul>
    </div>
    <router-view />
</template>

<style scoped>
.home-view {
    padding: 2rem;
    text-align: center;
}
</style>
