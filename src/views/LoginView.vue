<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

const authStore = useAuthStore();

const formData = ref({
    username: '',
    password: '',
});

const visible = ref(false);

watch(
    () => authStore.token,
    (newValue) => {
        if (newValue) {
            router.push('/');
        }
    },
);
// watch(
//     () => authStore.error,
//     (newValue) => {
//         if (newValue) {
//             visible.value = true;
//             setTimeout(() => {
//                 visible.value = false;
//             }, 3000);
//         }
//     },
// );

const onSubmit = async () => {
    await authStore.login(formData.value);
};
</script>

<template>
    <div id="login" class="login">
        <h3 class="title">Добро пожаловать</h3>

        <Form @submit="onSubmit" v-slot="$form" v-model="formData" class="flex justify-center flex-col gap-6">
            <div class="flex flex-col gap-1">
                <FloatLabel>
                    <AutoComplete v-model="formData.username" name="username" type="text" />
                    <label for="username">Username</label>
                </FloatLabel>
                <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{
                    $form.username.error?.message
                }}</Message>
            </div>
            <div class="flex flex-col gap-1">
                <FloatLabel>
                    <Password
                        v-model="formData.password"
                        name="password"
                        type="password"
                        :feedback="false"
                        :inputProps="{ autocomplete: 'current-password' }"
                    />
                    <label for="password">Password</label>
                </FloatLabel>
                <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
                    $form.email.error?.message
                }}</Message>
            </div>
            <Button type="submit" severity="secondary" label="Submit" />
        </Form>
    </div>

    <Dialog
        v-model:visible="visible"
        header="Ошибка входа"
        :style="{ width: '25rem' }"
        :position="'top'"
        :closable="true"
    >
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Неверный логин или пароль</span>
    </Dialog>
</template>

<style scoped lang="scss">
@media screen and (max-width: 430px) {
    .login {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .title {
        position: relative;
        bottom: 200px;
    }
}
</style>
