<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHouseStore } from '@/stores/houses';
import { fetchParkingByHouseId } from '@/api/parking';
import { getHouseById } from '@/api/houses';
import { createReservation } from '@/api/reservations';
import { ReservationStatus } from '@/interfaces/ReservationStatusEnum';
import type { House } from '@/interfaces/House';
import type { Parking } from '@/interfaces/Parking';
import { toUTCMidnight } from '@/utilities/toUTCMidnight';
import { sortParkingList, type SortState } from './utils/sortFunction';

const route = useRoute();
const router = useRouter();
const housesStore = useHouseStore();

const house = ref(housesStore.houses.find((h: House) => h.id === route.params.id));
const payload = ref({ houseId: '', spotId: '', startDate: new Date(), endDate: null });
const parkingSpaces = ref<Parking[]>([]);
const chosenSpace = ref<Parking | null>(null);
const sorted = ref<SortState>({ byNumber: '', byStatus: '', byDate: '' });

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
            const { data }: { data: Parking[] } = await fetchParkingByHouseId(route.params.id);
            parkingSpaces.value = data;
        } finally {
            payload.value = { houseId: '', spotId: '', startDate: new Date(), endDate: null };
            chosenSpace.value = null;
        }
    }
};

onMounted(async () => {
    if (!house.value) {
        const { data } = await getHouseById(route.params.id);
        house.value = data;
    }
    const { data }: { data: Parking[] } = await fetchParkingByHouseId(route.params.id);
    parkingSpaces.value = data;
});

function toggleSort(field: keyof SortState) {
    sorted.value[field] = sorted.value[field] === 'asc' ? 'desc' : sorted.value[field] === 'desc' ? '' : 'asc';
}

const sortedList = computed(() => sortParkingList(parkingSpaces.value, sorted.value));
</script>

<template>
    <div class="house mt-3">
        <i
            class="pi pi-history reservations-list"
            @click="router.push({ name: 'house-parking-reservations', params: { id: route.params.id } })"
            style="font-size: 1.2rem"
        ></i>
        <div class="grid grid-cols-2 grid-rows-2">
            <img class="row-span-2 rounded-md" v-if="house?.photoUrl" :src="house?.photoUrl" alt="house" />

            <h2 class="text-xl font-semibold text-center mt-10">{{ house?.name }}</h2>
            <p class="italic text-sm font-mono font-semibold text-center mb-10">{{ house?.address }}</p>
        </div>
        <DataTable size="small" :value="sortedList">
            <Column field="number">
                <template #header="slotProps">
                    #P
                    <span>{{ sorted.byNumber === 'asc' ? '▲' : sorted.byNumber === 'desc' ? '▼' : '' }}</span>
                </template>
            </Column>

            <Column field="status">
                <template #header="slotProps">
                    Статус
                    <span>{{ sorted.byNumber === 'asc' ? '▲' : sorted.byNumber === 'desc' ? '▼' : '' }}</span>
                </template>
                <template #body="slotProps">
                    <div v-if="slotProps.data.status === ReservationStatus.free" class="flex gap-1 items-center">
                        <span class="pi pi-circle-fill text-lime-500" />
                        <span>Свободно</span>
                    </div>
                    <div
                        v-else-if="slotProps.data.status === ReservationStatus.partiallyFree"
                        class="flex gap-1 items-center"
                    >
                        <span class="pi pi-circle-fill text-yellow-500" />
                        <span>Свободна по</span>
                    </div>
                    <div v-else class="flex gap-1 items-center">
                        <span class="pi pi-circle-fill text-red-500" />
                        <span>Бронь</span>
                    </div>
                </template>
            </Column>
            <Column field="status" header="Даты">
                <template #body="slotProps">
                    <div class="flex">
                        <DatePicker
                            inputClass="date-picker"
                            unstyled
                            readonly
                            date-format="dd.mm"
                            size="small"
                            :showTime="false"
                            :default-value="slotProps.data.reservations[0]?.startDate"
                        />
                        <span v-if="slotProps.data.status !== ReservationStatus.partiallyFree">-</span>
                        <DatePicker
                            v-if="slotProps.data.status !== ReservationStatus.partiallyFree"
                            inputClass="date-picker"
                            unstyled
                            readonly
                            date-format="dd.mm"
                            size="small"
                            :showTime="false"
                            :default-value="slotProps.data.reservations[0]?.endDate"
                        />
                    </div>
                </template>
            </Column>
            <Column field="action">
                <template #body="slotProps">
                    <Button
                        size="small"
                        icon="pi pi-sign-in"
                        severity="success"
                        rounded
                        variant="outlined"
                        aria-label="Search"
                        @click="chosenSpace = slotProps.data"
                    ></Button>
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog
        modal
        header="Edit Profile"
        :style="{ width: '25rem' }"
        position="right"
        :visible="Boolean(chosenSpace)"
        v-on:update:visible="chosenSpace = null"
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
            <Select class="w-full"></Select>
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
            <Button label="Cancel" text severity="secondary" @click="chosenSpace = null" autofocus />
            <Button label="Save" outlined severity="secondary" @click="postNewReservation" autofocus />
        </template>
    </Dialog>
</template>

<style lang="scss">
.house {
    position: relative;
}

.reservations-list {
    position: absolute;
    top: 10px;
    right: 10px;
}

.date-picker {
    text-align: center;
    max-width: 40px;
}
</style>
