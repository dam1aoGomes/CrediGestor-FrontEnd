import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import PromissoriasView from '../views/PromissoriasView.vue'
import DashboardView from '../views/DashboardView.vue'
import VendasView from '../views/VendasView.vue'
import RelatoriosView from '../views/RelatorioView.vue'
import UsersView from '../views/UsersView.vue'
import UserCreateView from '../views/UsersCreateView.vue'
import UserEditView from '../views/UsersEditView.vue'

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
  },
  {
    path: '/vendas',
    name: 'vendas',
    component: VendasView
  },
  {
    path: '/relatorios',
    name: 'relatorios',
    component: RelatoriosView
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: UsersView
  },
  {
    path: '/usuarios/novo',
    name: 'usuario-novo',
    component: UserCreateView
  },
  {
    path: '/usuarios/:id/editar',
    name: 'usuario-editar',
    component: UserEditView
  }
  // Adicione outras rotas aqui
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router