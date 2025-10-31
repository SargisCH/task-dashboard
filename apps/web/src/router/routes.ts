import { RouteRecordRaw } from 'vue-router';
import { AuthMeta } from './middlewares';
import { Role } from '@workspace/shared';

import DefaultLayout from '@/app/layouts/default.vue';
import AppLayout from '@/app/layouts/app.vue';
import LoginPage from '@/app/pages/login.vue';

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: DefaultLayout,
        children: [
            {
                path: '/',
                name: 'login',
                component: LoginPage,
                meta: {
                    auth: AuthMeta.None,
                },
            },
        ],
    },
    {
        path: '/app',
        component: AppLayout,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                component: () => import('@/app/pages/dashboard.vue'),
                meta: {
                    auth: AuthMeta.Required,
                },
            },
            {
                path: '/users',
                name: 'users',
                component: () => import('@/app/pages/users.vue'),
                meta: {
                    auth: AuthMeta.Required,
                    roles: [Role.Admin],
                },
            },
            {
                path: '/tasks',
                component: () => import('@/app/pages/tasks/index.vue'),
                children: [
                    {
                        path: 'list',
                        name: 'tasks',
                        component: () => import('@/app/pages/tasks/list.vue'),
                        meta: {
                            auth: AuthMeta.Required,
                            roles: [Role.Admin],
                        },
                    },
                    {
                        path: ':id',
                        name: 'task',
                        component: () => import('@/app/pages/tasks/task.vue'),
                        meta: {
                            auth: AuthMeta.Required,
                            roles: [Role.Admin],
                        },
                    },
                ],
            },
        ],
    },
];
