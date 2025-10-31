import { reactive } from 'vue';
import { useTitle } from '@vueuse/core';
import { defineStore } from 'pinia';
import { watch } from 'vue';
import { useRoute } from 'vue-router';

interface State {
    networkError: boolean;
    isRouteLoading: boolean;
    routeTitle: string;
}

export const useAppStore = defineStore('app', () => {
    const route = useRoute();
    const title = useTitle();

    const state: State = reactive({
        networkError: false,
        isRouteLoading: false,
        routeTitle: 'Task app',
    });

    watch(
        () => route.name,
        () => {
            title.value = route.name.toString();
            state.routeTitle = route.name.toString();
        }
    );

    return { state };
});
