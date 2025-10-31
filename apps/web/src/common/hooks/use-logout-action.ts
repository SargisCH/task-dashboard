import { useAccountStore } from '@/stores/account';
import { useQuasar, DialogChainObject } from 'quasar';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../api';
import { usePromiseState, UsePromiseStateRetrun } from './use-promise-state';

export interface UseLogoutActionReturn<TResult, TError, TPayload>
    extends UsePromiseStateRetrun<TResult, TError, TPayload> {
    logout: () => void;
}

export function useLogoutAction(): UseLogoutActionReturn<void, unknown, undefined> {
    const router = useRouter();
    const $q = useQuasar();

    const accountStore = useAccountStore();

    let dialog: DialogChainObject | undefined = undefined;

    function showLogoutDialog(): void {
        dialog = $q.dialog({
            message: 'Signing out ...',
            progress: true,
            persistent: true,
            ok: false,
            color: 'primary',
        });
    }

    function hideLogoutDialog(): void {
        if (dialog) dialog.hide();
    }

    const logoutAction = usePromiseState<void, unknown>(
        async () => {
            await api.auth.logout();
            accountStore.setAuthenticated(false);
            hideLogoutDialog();

            $q.notify({
                icon: 'mdi-check',
                color: 'positive',
                message: 'Logged out successfully!',
                timeout: 1000,
            });

            router.push({ name: 'login' });
        },
        () => {
            hideLogoutDialog();

            $q.notify({
                icon: 'mdi-close',
                color: 'negative',
                message: 'Logout failed',
                timeout: 1000,
            });
        }
    );

    function logout(): void {
        showLogoutDialog();
        logoutAction.execute(500);
    }

    return reactive({ logout, ...logoutAction });
}
