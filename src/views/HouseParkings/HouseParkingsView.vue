<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHouseStore } from '@/stores/houses';
import { fetchParkingByHouseId } from '@/api/parking';
import { getHouseById } from '@/api/houses';

import { ReservationStatus } from '@/interfaces/ReservationStatusEnum';
import type { House } from '@/interfaces/House';
import type { Parking } from '@/interfaces/Parking';

import { sortParkingList, type SortState } from './utils/sortFunction';
import NewReservation from './components/NewReservation.vue';
import type { Reservation } from '@/interfaces/Reservation';

const route = useRoute();
const router = useRouter();
const housesStore = useHouseStore();

const house = ref(housesStore.houses.find((h: House) => h.id === route.params.id));

const apartments = ref([]);
const parkingSpaces = ref<Parking[]>([]);
const chosenSpace = ref<Parking | null>(null);
const sorted = ref<SortState>({ byNumber: '', byStatus: '', byDate: '' });

const fetchParkingSpaces = async () => {
    const { data }: { data: Parking[] } = await fetchParkingByHouseId(route.params.id);
    parkingSpaces.value = data;
};

const correctEndDate = (reservations: Reservation[]) => {
    const result = reservations.reduce(
        (acc, curr) => {
            if (acc[0] === '') return [curr.endDate, false];
            if (acc[1]) return acc;
            if (acc[0] === curr.startDate) return [curr.endDate, false];
            if (acc[0] !== curr.startDate) return [acc[0], true];
        },
        ['', false],
    );

    return result[0];
};

onMounted(async () => {
    if (!house.value) {
        const { data } = await getHouseById(route.params.id);
        house.value = data;
    }
    fetchParkingSpaces();
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
                            :default-value="correctEndDate(slotProps.data.reservations)"
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

    <NewReservation v-model:chosenSpace="chosenSpace" :updateParking="fetchParkingSpaces"></NewReservation>
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
