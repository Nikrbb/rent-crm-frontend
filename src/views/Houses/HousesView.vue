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
    router.push({ name: 'house-parking', params: { id: houseId } });
};

const pastThrough = {
    body: {
        class: 'houses-item__body',
    },
    caption: {
        class: 'houses-caption',
    },
};
</script>

<template>
    <div class="home-view">
        <h1 class="text-2xl mb-5">Выберите дом</h1>

        <div class="houses-list">
            <Card
                class="houses-item border rounded-md border-gray-600"
                v-for="house in housesStore.houses"
                v-bind:key="house.id"
                @click="chooseHouse(house.id)"
                :pt="pastThrough"
            >
                <template #header>
                    <img class="houses-item__photo rounded-md" :src="house.photoUrl" alt="" />
                </template>
                <template #title>{{ house.name }}</template>
                <template #subtitle>{{ house.address }}</template>
            </Card>
        </div>
    </div>
    <router-view />
</template>

<style lang="scss">
.home-view {
    padding: 2rem;
    text-align: center;
}

.houses-list {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    column-gap: 5px;
    row-gap: 15px;
}

.p-card-body.houses-item {
    &__body {
        padding: 5px 0;
        gap: 0;
    }
}

.p-card-caption.houses-caption {
    gap: 0;
}
</style>
