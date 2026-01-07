import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  }
  // Adicione outras rotas aqui
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router