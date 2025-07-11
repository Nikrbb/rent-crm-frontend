<script setup lang="ts">
import { useErrorStore } from '@/stores/error';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';

const errorStore = useErrorStore();

const { message, visible } = storeToRefs(errorStore);
watch(
    () => message,
    (val) => {
        if (val) {
            console.log(message);
        }
    },
);
const { clear } = errorStore;
</script>

<template>
    <Toast v-if="visible" :severity="'error'" :summary="'Ошибка'" :detail="message" @hide="clear" />
</template>
