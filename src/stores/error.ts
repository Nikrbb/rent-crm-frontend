import { defineStore } from 'pinia';

export const useErrorStore = defineStore('error', {
    state: () => ({
        message: '',
        visible: false,
    }),
    actions: {
        showError(msg: string) {
            this.message = msg;
            this.visible = true;
        },
        clear() {
            this.message = '';
            this.visible = false;
        },
    },
});
