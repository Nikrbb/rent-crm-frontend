<script setup lang="ts">
import { onMounted, onUpdated, ref, watch } from 'vue';
import { createReservation } from '@/api/reservations';
import { toUTCMidnight } from '@/utilities/toUTCMidnight';
import type { Parking } from '@/interfaces/Parking';

const { updateParking, apartments } = defineProps(['updateParking', 'apartments']);
const chosenSpace = defineModel<Parking | null>('chosenSpace');
const emit = defineEmits(['update:chosenSpace']);

const close = () => {
    emit('update:chosenSpace', null);
};

const payload = ref({ houseId: '', spotId: '', startDate: new Date(), endDate: null });

const postNewReservation = async () => {
    const startDate = toUTCMidnight(payload.value.startDate);
    const endDate = toUTCMidnight(payload.value.endDate);

    if (chosenSpace.value) {
        try {
            await createReservation({
                ...payload.value,
                houseId: chosenSpace.value.houseId,
                spotId: chosenSpace.value.id,
                startDate,
                endDate,
            });
            updateParking();
        } finally {
            payload.value = { houseId: '', spotId: '', startDate: new Date(), endDate: null };
            close();
        }
    }
};
</script>

<template>
    <Dialog
        modal
        header="Edit Profile"
        :style="{ width: '25rem' }"
        position="right"
        :visible="!!chosenSpace"
        @update:visible="close"
    >
        <template #header>
            <div class="inline-flex items-center justify-center gap-2">
                <Avatar image="https://imgpng.ru/d/parking_PNG59.png" shape="circle" />
                <span class="font-bold whitespace-nowrap">{{ chosenSpace?.number }}</span>
            </div>
        </template>

        <span class="text-surface-500 dark:text-surface-400 block mb-8">Добавить бронирование</span>
        <div class="flex items-center gap-4 mb-4">
            <label for="username" class="font-semibold w-24">Apt</label>
            <Select class="w-full" :options="[]"></Select>
        </div>
        <div class="flex items-center gap-4 mb-4">
            <label for="username" class="font-semibold w-24">Start</label>
            <DatePicker v-model="payload.startDate" class="w-full" name="date" dateFormat="dd.mm.yy" fluid />
        </div>
        <div class="flex items-center gap-4 mb-2">
            <label for="email" class="font-semibold w-24">End</label>
            <DatePicker v-model="payload.endDate" class="w-full" name="date" dateFormat="dd.mm.yy" fluid />
        </div>

        <template #footer>
            <Button label="Cancel" text severity="secondary" @click="close()" autofocus />
            <Button label="Save" outlined severity="secondary" @click="postNewReservation" autofocus />
        </template>
    </Dialog>
</template>
<style lang="scss"></style>
