import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

import axios from 'axios';

const targetPaths = ['/api/user', '/api/admin'];

axios.interceptors.request.use(config => {
    const urlPath = config.url;

    if (targetPaths.some(path => urlPath.startsWith(path))) {
        config.headers[localStorage.getItem('elysiaBlogTokenName')] = localStorage.getItem('elysiaBlogToken')
    }
    return config;
});

app.use(router)
app.mount('#app')