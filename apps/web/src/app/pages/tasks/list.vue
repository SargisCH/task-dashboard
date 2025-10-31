<template>
    <AppPage :loading="tasksAction.counter === 0">
        <template v-slot:header>
            <AppPageHeader title="Tasks" icon="mdi-account-supervisor" />
        </template>

        <AppCard>
            <template #titleBar>
                <div class="row q-gutter-y-md full-width">
                    <div class="col-9 self-center flex row">
                        <q-input
                            class="col-6 col-md-3 q-mt-sm"
                            outlined
                            rounded
                            dense
                            debounce="500"
                            v-model="filter.title"
                            placeholder="search title"
                        >
                            <template v-slot:prepend>
                                <q-icon name="mdi-magnify" />
                            </template>
                        </q-input>
                        <q-input
                            class="q-ml-sm col-6 col-md-3 q-mt-sm"
                            outlined
                            rounded
                            dense
                            debounce="500"
                            v-model="filter.description"
                            placeholder="search description"
                        >
                            <template v-slot:prepend>
                                <q-icon name="mdi-magnify" />
                            </template>
                        </q-input>
                        <q-select
                            class="q-ml-sm col-6 col-md-3 q-mt-sm"
                            label="assignee"
                            :options="userOptions"
                            :model-value="filter.assigneeId"
                            @update:model-value="updateFilterAssignee($event)"
                            outlined
                            emit-value
                            map-options
                        >
                        </q-select>
                    </div>
                    <div class="col-3 text-right self-center">
                        <q-btn
                            icon="mdi-plus"
                            label="Add"
                            :disable="tasksAction.isLoading"
                            color="primary"
                            rounded
                            @click="taskCreateDialog"
                        />
                    </div>
                </div>
            </template>

            <q-card-section>
                <q-table
                    class="no-shadow"
                    row-key="id"
                    :rows="tasksAction.state.elements"
                    :columns="columns"
                    :loading="!tasksAction.isReady"
                    @request="(props) => tasksAction.execute(500, props.pagination)"
                    color="primary"
                    :rows-per-page-options="[5, 10, 20, 50]"
                >
                    <template v-slot:body-cell-assign="props">
                        <q-td class="text-right">
                            <q-select
                                class="col-6"
                                name="role"
                                label="assignee"
                                :options="userOptions"
                                :model-value="props.row.assigneeId"
                                @update:model-value="updateTaskAssignee(props.value, $event)"
                                outlined
                                emit-value
                                map-options
                            >
                            </q-select>
                        </q-td>
                    </template>
                    <template v-slot:body-cell-actions="props">
                        <q-td class="text-right">
                            <q-btn icon="mdi-cog" size="10px" round color="secondary">
                                <q-menu anchor="bottom left" self="top right">
                                    <div class="column no-wrap q-pa-md">
                                        <div class="text-h6 q-mb-md">Actions</div>
                                        <div class="q-mt-sm">
                                            <q-btn
                                                :to="{ name: 'task', params: { id: props.value } }"
                                                >Edit</q-btn
                                            >
                                        </div>
                                        <div class="q-mt-sm">
                                            <q-btn @click="taskDeleteDialog(props.value)"
                                                >Delete</q-btn
                                            >
                                        </div>
                                    </div>
                                </q-menu>
                            </q-btn>
                        </q-td>
                    </template>
                </q-table>
            </q-card-section>
        </AppCard>
    </AppPage>
</template>

<script setup lang="ts">
import { api, usePromiseState, ResponseError } from '@/common';
import {
    ErrorResponse,
    PaginationResponse,
    TaskResponse,
    UserProfileResponse,
} from '@workspace/shared';
import { QTableColumn, QTableProps, useQuasar } from 'quasar';
import TaskCreateDialog from '@/app/components/dialogs/TaskCreateDialog.vue';
import TaskDeleteDialog from '@/app/components/dialogs/TaskDeleteDialog.vue';
import { AxiosError } from 'axios';

const $q = useQuasar();

const pagination = ref<QTableProps['pagination']>({
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
    sortBy: 'role',
    descending: false,
});

const filter = ref({
    title: '',
    description: '',
    assigneeId: null,
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

const updateTaskAssignee = async (taskId: number, assigneeId: number) => {
    taskAssigneeAction.execute(0, { taskId, assigneeId });
};
const updateFilterAssignee = async (assigneeId: number) => {
    filter.value.assigneeId = assigneeId;
};

const taskAssigneeAction = usePromiseState<TaskResponse, ResponseError>(
    async (payload: { taskId: number; assigneeId: number }) => {
        let data;
        try {
            const { data } = await api.tasks.assignUser(payload.taskId, {
                assigneeId: payload.assigneeId,
            });
            tasksAction.execute(0, pagination.value);
            return data;
        } catch (e: any) {
            const message =
                (e?.response?.data as ErrorResponse)?.message ??
                taskAssigneeAction.error.message ??
                'Error updating assignee';
            $q.notify({
                icon: 'mdi-close',
                color: 'negative',
                message,
                timeout: 5000,
            });
        }
        return data;
    }
);

const columns: QTableColumn<TaskResponse>[] = [
    {
        name: 'title',
        label: 'Title',
        field: 'title',
        align: 'center',
    },
    {
        name: 'description',
        label: 'Description',
        field: 'description',
        align: 'left',
        sortable: true,
    },
    {
        name: 'status',
        label: 'Status',
        field: 'status',
        align: 'left',
        sortable: true,
    },
    {
        name: 'createdAt',
        label: 'Created at',
        field: (row) =>
            new Date(row.createdAt).toLocaleDateString([], {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }),
        align: 'left',
        sortable: true,
    },
    {
        name: 'assign',
        label: 'Assignee',
        field: 'id',
        align: 'right',
    },
    {
        name: 'actions',
        label: 'Actions',
        field: 'id',
        align: 'right',
    },
];

const tasksAction = usePromiseState<PaginationResponse<TaskResponse>, ResponseError>(
    async (paginationPayload: QTableProps['pagination']) => {
        const { page, rowsPerPage, sortBy, descending } = paginationPayload;

        const res = await api.tasks.getMany({
            page: page,
            take: rowsPerPage,
            sortBy: sortBy,
            descending: descending,
            filter: {
                title: filter.value.title,
                description: filter.value.description,
                assigneeId: filter.value.assigneeId,
            },
        });

        pagination.value.page = page;
        pagination.value.rowsPerPage = rowsPerPage;
        pagination.value.rowsNumber = res.data.total;
        pagination.value.sortBy = sortBy;
        pagination.value.descending = descending;

        return res.data;
    }
);

tasksAction.execute(500, pagination.value);

function taskCreateDialog(): void {
    $q.dialog({
        component: TaskCreateDialog,
    }).onOk(() => {
        tasksAction.execute(500, pagination.value);
    });
}
function taskDeleteDialog(id: number): void {
    $q.dialog({
        component: TaskDeleteDialog,
        componentProps: {
            id,
        },
    }).onOk(() => {
        tasksAction.execute(500, pagination.value);
    });
}
watch(
    filter,
    () => {
        pagination.value.page = 1;
        tasksAction.execute(0, pagination);
    },
    {
        deep: true,
        immediate: false,
    }
);
</script>
