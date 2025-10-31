import { createApp } from 'vue';
import { pinia } from './stores';
import router from './router';
import { Quasar, Notify, Dialog } from 'quasar';
import { configure as veeConfigure } from 'vee-validate';

import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/mdi-v6/mdi-v6.css';
import 'quasar/src/css/index.sass';
import './assets/main.scss';

import App from './app/App.vue';

veeConfigure({
    validateOnInput: true,
});

const app = createApp(App);

app.use(pinia);
app.use(router);

app.use(Quasar, {
    plugins: {
        Notify,
        Dialog,
    },
});

app.mount('#app').$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*');
});
