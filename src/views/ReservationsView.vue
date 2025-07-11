<script setup lang="ts">
import { deleteReservation, fetchAllReservations } from '@/api/reservations';
import { ref, onMounted } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import type { Reservation } from '@/interfaces/Reservation';

const confirm = useConfirm();
const toast = useToast();

const reservations = ref([]);

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
                const result = await deleteReservation(reservation.data.id);
                reservations.value = result.data.reservations;
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

onMounted(async () => {
    const { data } = await fetchAllReservations();

    reservations.value = data;
});
</script>

<template>
    <Toast />
    <ConfirmDialog></ConfirmDialog>
    <div class="reservations">
        <DataTable :value="reservations">
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
