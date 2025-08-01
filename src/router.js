import { createRouter, createWebHistory } from 'vue-router'
import LoginView from './components/Login.vue'
import MainView from './components/Main.vue'
import UserProfile from './components/UserProfile.vue'
import Service from './components/Service.vue'
import Wiki from './components/Wiki.vue'

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },
    { path: '/main', component: MainView },
    { path: '/user_profile', component: UserProfile},
    { path: '/service', component: Service},
    { path: '/wiki', component: Wiki},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router