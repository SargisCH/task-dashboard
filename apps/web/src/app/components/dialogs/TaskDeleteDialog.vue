<template>
    <AppDialog
        icon="mdi-plus"
        title="Delete Task"
        @submit="({ ok }) => saveAction.execute(500, ok)"
        :width="600"
        is-form
    >
        <template #default>
            <q-card-section>
                <span class="q-ml-sm">Are you sure you want to delete this task?</span>
            </q-card-section>
            <q-card-section class="text-center text-negative" v-if="saveError">
                {{ saveError }}
            </q-card-section>
        </template>

        <template #actions="{ cancel }">
            <q-space />
            <q-btn
                color="secondary"
                icon="mdi-close"
                label="Close"
                :disable="saveAction.isLoading"
                @click="cancel"
                rounded
                outline
            />

            <q-btn
                color="primary"
                icon="mdi-plus"
                label="Delete"
                :loading="saveAction.isLoading"
                :disable="saveAction.isLoading"
                type="submit"
                rounded
            />
        </template>
    </AppDialog>
</template>

<script setup lang="ts">
import { api, usePromiseState, ResponseError } from '@/common';
import { useQuasar } from 'quasar';
const props = defineProps(['id']);

const $q = useQuasar();

const saveAction = usePromiseState<void, ResponseError>(async (ok: () => void) => {
    await api.tasks.deleteTask(props.id);

    $q.notify({
        icon: 'mdi-check',
        color: 'positive',
        message: 'Saved successfully',
        timeout: 1000,
    });

    ok();
});

const saveError = computed<string>(() => {
    if (saveAction.error) return 'task_create_erro_default';

    return undefined;
});
</script>
