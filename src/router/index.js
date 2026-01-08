import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import PromissoriasView from '../views/PromissoriasView.vue'
import DashboardView from '../views/DashboardView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/promissorias',
    name: 'promissorias',
    component: PromissoriasView
  }
  // Adicione outras rotas aqui
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router