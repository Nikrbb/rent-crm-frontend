<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useApartmentsStore } from '@/stores/apartments';
import { useHouseStore } from '@/stores/houses';
import { useParkingStore } from '@/stores/parking';

const housesStore = useHouseStore();
const apartmentsStore = useApartmentsStore();
const parkingStore = useParkingStore();
const houseModel = ref({
    name: '',
    address: '',
});

const apartmentModel = ref<{ houseId: number; number: string; note?: string }>({
    houseId: NaN,
    number: '',
});

const parkingModel = ref<{ houseId: number; number: string; location?: string }>({
    houseId: NaN,
    number: '',
});

onMounted(() => {
    housesStore.getAll();
    apartmentsStore.getAll();
    parkingStore.getAll();
});

const createHouse = () => {
    housesStore.create(houseModel.value);
    apartmentModel.value = {
        houseId: NaN,
        number: '',
    };
};

const createApartment = async () => {
    apartmentsStore.createApartment(apartmentModel.value);
    apartmentModel.value = {
        houseId: NaN,
        number: '',
    };
};

const createParking = async () => {
    parkingStore.create(parkingModel.value);
    parkingModel.value = {
        houseId: NaN,
        number: '',
    };
};
</script>

<template>
    <article class="houses">
        <h1 class="title">create</h1>
        <Tabs class="mt-10" value="0">
            <TabList>
                <Tab value="0">Дом</Tab>
                <Tab value="1">Квартира</Tab>
                <Tab value="2">Паркоместо</Tab>
            </TabList>

            <TabPanels>
                <TabPanel value="0">
                    <Form @submit="createHouse" v-model="houseModel" class="houses__form">
                        <FloatLabel>
                            <AutoComplete v-model="houseModel.name" name="name" type="text" />
                            <label for="name">Название дома</label>
                        </FloatLabel>
                        <FloatLabel>
                            <AutoComplete v-model="houseModel.address" name="address" type="text" />
                            <label for="address">Адрес</label>
                        </FloatLabel>
                        <Button type="submit">Добавить</Button>
                    </Form>

                    <DataTable :value="housesStore.houses" table-class="mt-10">
                        <Column field="name" header="Название"></Column>
                        <Column field="address" header="Адрес"></Column>
                    </DataTable>
                </TabPanel>

                <TabPanel value="1">
                    <Form @submit="createApartment" v-model="apartmentModel" class="houses__form">
                        <Select
                            v-model="apartmentModel.houseId"
                            :options="housesStore.houses"
                            :default-value="0"
                            optionLabel="name"
                            option-value="id"
                            placeholder="Выберите дом/жк"
                        />

                        <FloatLabel>
                            <AutoComplete v-model="apartmentModel.number" name="number" type="text" />
                            <label for="number">Номер квартиры</label>
                        </FloatLabel>

                        <FloatLabel>
                            <AutoComplete v-model="apartmentModel.note" name="note" type="text" />
                            <label for="note">Заметки</label>
                        </FloatLabel>
                        <Button type="submit">Добавить</Button>
                    </Form>

                    <DataTable :value="apartmentsStore.apartments" table-class="mt-10">
                        <Column field="number" header="Апратаменты №"></Column>
                        <Column field="note" header="Заметка"></Column>
                    </DataTable>
                </TabPanel>

                <TabPanel value="2">
                    <Form @submit="createParking" v-model="houseModel" class="houses__form">
                        <Select
                            v-model="parkingModel.houseId"
                            :options="housesStore.houses"
                            :default-value="0"
                            optionLabel="name"
                            option-value="id"
                            placeholder="Выберите дом/жк"
                        />
                        <FloatLabel>
                            <AutoComplete v-model="parkingModel.number" name="number" type="text" />
                            <label for="number">Номер паркоместа</label>
                        </FloatLabel>

                        <FloatLabel>
                            <AutoComplete v-model="parkingModel.location" name="location" type="text" />
                            <label for="location">Заметки</label>
                        </FloatLabel>
                        <Button type="submit">Добавить</Button>
                    </Form>

                    <DataTable :value="parkingStore.spots" table-class="mt-10">
                        <Column field="number" header="Паркоместо №"></Column>
                        <Column field="location" header="Заметка"></Column>
                    </DataTable>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </article>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 430px) {
    .houses {
        padding: 20px;

        &__form {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 25px;

            margin-top: 20px;
        }
    }

    .title {
        font-size: 25px;
        text-align: center;
    }
}
</style>
