<template>
    <AppPage :loading="taskAction.isLoading">
        <template v-slot:header> </template>

        <div class="row q-col-gutter-lg">
            <div class="col-12">
                <AppCard
                    title="Task details"
                    @submit="saveAction.execute(500)"
                    :initial-values="form"
                    is-form
                >
                    <template #default>
                        <q-card-section class="row q-col-gutter-md">
                            <VInput
                                class="col-12 col-md-6"
                                name="title"
                                v-model="form.title"
                                :disable="saveAction.isLoading"
                                label="title"
                                outlined
                            >
                            </VInput>

                            <VInput
                                class="col-12 col-md-6"
                                name="lastName"
                                v-model="form.description"
                                :disable="saveAction.isLoading"
                                label="Description"
                                outlined
                            >
                            </VInput>
                        </q-card-section>
                        <q-card-section class="row q-col-gutter-md">
                            <q-select
                                class="col-6"
                                name="status"
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

                    <template #actions>
                        <q-space />

                        <q-btn
                            icon="mdi-check"
                            label="Save"
                            type="submit"
                            :loading="saveAction.isLoading"
                            :disable="saveAction.isLoading"
                            color="primary"
                            rounded
                        />
                    </template>
                </AppCard>
            </div>
        </div>
    </AppPage>
</template>

<script setup lang="ts">
import { api, usePromiseState, ResponseError } from '@/common';
import {
    ErrorResponse,
    PaginationResponse,
    Status,
    TaskCreateDto,
    TaskResponse,
    UserProfileResponse,
    statusOptions,
} from '@workspace/shared';
import { useQuasar, date } from 'quasar';
const $q = useQuasar();
const route = useRoute();

const form = reactive<TaskCreateDto>({
    title: '',
    description: '',
    status: Status.ToDo,
    assigneeId: null,
    startDate: null,
    endDate: null,
});

const taskDateRange = ref({
    from: null,
    to: null,
});

const userOptions = ref([]);

function loadForm(data: TaskResponse) {
    form.title = data.title;
    form.description = data.description;
    form.status = data.status;
    form.assigneeId = data.assigneeId;
    if (data.startDate && data.endDate) {
        taskDateRange.value.from = date.formatDate(data.startDate, 'YYYY/MM/DD');
        taskDateRange.value.to = date.formatDate(data.endDate, 'YYYY/MM/DD');
    }
}

function loadUserOptions(users: UserProfileResponse[]) {
    userOptions.value = users.map((user) => ({
        label: `${user.firstName} ${user.lastName} `,
        value: user.id,
    }));
}

const taskAction = usePromiseState<TaskResponse, ResponseError>(async () => {
    const { data } = await api.tasks.getOne(Number(route.params.id));
    loadForm(data);
    return data;
});

taskAction.execute(500);

const usersAction = usePromiseState<PaginationResponse<UserProfileResponse>, ResponseError>(
    async () => {
        const { data } = await api.users.getMany({ page: 1, take: 50 });
        loadUserOptions(data.elements);
        return data;
    }
);

usersAction.execute(500);

const saveAction = usePromiseState<void, ResponseError>(async () => {
    const { data } = await api.tasks.updateOne(taskAction.state.id, {
        ...form,
        startDate: new Date(taskDateRange.value.from),
        endDate: new Date(taskDateRange.value.to),
    });
    loadForm(data);

    $q.notify({
        icon: 'mdi-check',
        color: 'positive',
        message: 'Saved successfully',
        timeout: 1000,
    });
});

const saveError = computed<string>(() => {
    if (saveAction.error)
        return (
            (saveAction.error.response.data as ErrorResponse)?.message ??
            saveAction.error.message ??
            'Error updating task'
        );

    return undefined;
});

watch(form, () => {
    saveAction.error = undefined;
});
</script>
