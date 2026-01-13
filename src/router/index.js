import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import PromissoriasView from '../views/PromissoriasView.vue'
import DashboardView from '../views/DashboardView.vue'
import VendasView from '../views/VendasView.vue'
import RelatoriosView from '../views/RelatorioView.vue'
import UsersView from '../views/UsersView.vue'
import UserCreateView from '../views/UsersCreateView.vue'
import UserEditView from '../views/UsersEditView.vue'
import NovaVendaView from '../views/NovaVendaView.vue'
import EditSaleView from '../views/EditarVendaView.vue'
import ClientView from '../views/ClientView.vue'
import ClientCreateView from '../views/ClientCreateView.vue'
import ClientEditView from '../views/ClientEditView.vue'

import { useAuthStore } from '../stores/auth.js'

const routes = [
  {
    path: '/',
    redirect: '/dashboard' // Redireciona a raiz para /dashboard
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/promissorias',
    name: 'promissorias',
    component: PromissoriasView,
    meta: { requiresAuth: true }
  },
  {
    path: '/vendas',
    name: 'vendas',
    component: VendasView,
    meta: { requiresAuth: true }
  },
  {
    path: '/relatorios',
    name: 'relatorios',
    component: RelatoriosView,
    meta: { requiresAuth: true }
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: UsersView,
    meta: { requiresAuth: true }
  },
  {
    path: '/usuarios/novo',
    name: 'usuario-novo',
    component: UserCreateView,
    meta: { requiresAuth: true }
  },
  {
    path: '/usuarios/:id/editar',
    name: 'usuario-editar',
    component: UserEditView,
    meta: { requiresAuth: true }
  },
  {
    path: '/vendas/nova',
    name: 'nova-venda',
    component: NovaVendaView,
    meta: { requiresAuth: true }
  },
  {
    path: '/vendas/:id/editar',
    name: 'editar-venda',
    component: EditSaleView,
    meta: { requiresAuth: true }
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: ClientView,
    meta: { requiresAuth: true }
  },
  {
    path: '/criar-clientes',
    name: 'criar-clientes',
    component: ClientCreateView,
    meta: { requiresAuth: true }
  },
  {
    path: '/editar-clientes/:id',
    name: 'editar-clientes',
    component: ClientEditView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Verifica se a rota para onde o usuário vai exige autenticação
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Se exigir e não estiver logado, manda para o Login
    next({ name: 'login' })
  } 
  // Opcional: Se o usuário já estiver logado e tentar ir para o Login, manda para a Home
  else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
  } 
  // Caso contrário, permite a navegação
  else {
    next()
  }
})

export default router