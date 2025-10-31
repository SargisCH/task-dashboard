<template>
    <AppDialog
        icon="mdi-plus"
        title="Create a task"
        @submit="({ ok }) => saveAction.execute(500, ok)"
        :validation-schema="TaskCreateDto"
        :initial-values="form"
        :width="600"
        is-form
    >
        <template #default>
            <q-card-section>
                <div class="row q-col-gutter-md">
                    <VInput
                        class="col-12 col-md-6"
                        name="title"
                        v-model="form.title"
                        :disable="saveAction.isLoading"
                        label="Title"
                        outlined
                    >
                    </VInput>

                    <VInput
                        class="col-12 col-md-6"
                        name="description"
                        v-model="form.description"
                        :disable="saveAction.isLoading"
                        label="Description"
                        outlined
                    >
                    </VInput>
                </div>
            </q-card-section>
            <q-card-section class="row q-col-gutter-md">
                <q-select
                    class="col-6"
                    name="role"
                    v-model="form.status"
                    :disable="saveAction.isLoading"
                    label="Status"
                    :options="statusOptions"
                    outlined
                    emit-value
                    map-options
                >
                </q-select>
                <q-select
                    class="col-6"
                    name="role"
                    v-model="form.assigneeId"
                    :disable="saveAction.isLoading"
                    label="Assignee"
                    :options="userOptions"
                    outlined
                    emit-value
                    map-options
                >
                </q-select>
            </q-card-section>
            <q-card-section>
                <div class="q-pa-md">
                    <q-date v-model="taskDateRange" range />
                </div>
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
                label="Add"
                :loading="saveAction.isLoading"
                :disable="saveAction.isLoading"
                type="submit"
                rounded
            />
        </template>
    </AppDialog>
</template>

<script setup lang="ts">
import {
    ErrorResponse,
    PaginationResponse,
    Status,
    TaskCreateDto,
    UserProfileResponse,
    statusOptions,
} from '@workspace/shared';
import { api, usePromiseState, ResponseError } from '@/common';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const form = reactive<TaskCreateDto>({
    title: '',
    description: '',
    status: Status.ToDo,
    assigneeId: null,
    startDate: null,
    endDate: null,
});

const taskDateRange = ref<{ from: string; to: string }>({
    from: '',
    to: '',
});

const userOptions = ref([]);

function loadUserOptions(users: UserProfileResponse[]) {
    userOptions.value = users.map((user) => ({
        label: `${user.firstName} ${user.lastName} `,
        value: user.id,
    }));
}

const usersAction = usePromiseState<PaginationResponse<UserProfileResponse>, ResponseError>(
    async () => {
        const { data } = await api.users.getMany({ page: 1, take: 50 });
        loadUserOptions(data.elements);
        return data;
    }
);
usersAction.execute(500);

const saveAction = usePromiseState<void, ResponseError>(async (ok: () => void) => {
    await api.tasks.createOne({
        ...form,
        startDate: new Date(taskDateRange.value.from),
        endDate: new Date(taskDateRange.value.to),
    });

    $q.notify({
        icon: 'mdi-check',
        color: 'positive',
        message: 'Saved successfully',
        timeout: 1000,
    });

    ok();
});

const saveError = computed<string>(() => {
    console.log('error', saveAction.state, saveAction);
    if (saveAction.error) {
        const message =
            (saveAction.error.response.data as ErrorResponse)?.message ??
            saveAction.error.message ??
            'Error creating task';
        return message;
    }

    return undefined;
});

watch(form, () => {
    saveAction.error = undefined;
});
</script>
