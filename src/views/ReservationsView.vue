<script setup lang="ts">
import { useLoadingStore } from '@/stores/loading';
import { deleteReservation, fetchAllReservations, fetchReservationsByHouse } from '@/api/reservations';
import { ref, onMounted } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import type { Reservation } from '@/interfaces/Reservation';
import { useRoute } from 'vue-router';

const route = useRoute();
const confirm = useConfirm();
const toast = useToast();

const reservations = ref([]);

const loadReservationsHistory = async () => {
    let data = [];
    const houseId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

    if (houseId) {
        const response = await fetchReservationsByHouse(houseId);
        data = response.data;
    } else {
        const response = await fetchAllReservations();
        data = response.data;
    }

    reservations.value = data;
};

const confirm1 = (reservation: { data: Reservation }) => {
    confirm.require({
        message: 'Уверены что хотите удалить бронирывание?',
        header: 'Danger Zone',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Отмена',
        rejectProps: {
            label: 'Отмена',
            severity: 'secondary',
            outlined: true,
        },
        acceptProps: {
            label: 'Удалить',
            severity: 'danger',
        },
        accept: async () => {
            try {
                await deleteReservation(reservation.data.id);
                loadReservationsHistory();
                toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Бронь удалена', life: 3000 });
            } catch (error) {
                throw new Error(error instanceof Error ? error.message : String(error));
            }
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'Rejected', detail: 'Отмена', life: 3000 });
        },
    });
};

const loadingStore = useLoadingStore();
loadingStore.stopLoading();

onMounted(() => loadReservationsHistory());
</script>

<template>
    <Toast />
    <ConfirmDialog></ConfirmDialog>
    <div class="reservations">
        <DataTable :value="reservations" size="small">
            <Column field="spotNumber" header="#P" />
            <Column field="startDate" header="Заезд">
                <template #body="slotProps">
                    <DatePicker
                        inputClass="date-picker"
                        disabled
                        date-format="dd.mm"
                        unstyled
                        :default-value="slotProps.data.startDate"
                    />
                </template>
            </Column>
            <Column field="endDate" header="Выезд">
                <template #body="slotProps">
                    <DatePicker
                        inputClass="date-picker"
                        readonly
                        disabled
                        date-format="dd.mm"
                        unstyled
                        breakpoint="100"
                        :default-value="slotProps.data.endDate"
                    /> </template
            ></Column>
            <Column>
                <template #body="slotProps"
                    ><Button @click="confirm1(slotProps)" severity="warn">delete</Button>
                </template></Column
            >
        </DataTable>
    </div>
</template>

<style>
.reservations {
    padding: 2rem;
}

.date-picker {
    text-align: center;
    max-width: 40px;
}
</style>
