<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '../components/NavBar.vue'


const STORAGE_KEY = 'cg_users'

function seedUsers() {
  return [
    { id: 1, nome: 'Sophia Clark', email: 'sophia.clark@example.com', papel: 'Administrador', status: 'Ativo' },
    { id: 2, nome: 'Ethan Bennett', email: 'ethan.bennett@example.com', papel: 'Vendedor', status: 'Ativo' },
    { id: 3, nome: 'Olivia Carter', email: 'olivia.carter@example.com', papel: 'Vendedor', status: 'Ativo' },
    { id: 4, nome: 'Liam Harper', email: 'liam.harper@example.com', papel: 'Vendedor', status: 'Inativo' },
    { id: 5, nome: 'Ava Foster', email: 'ava.foster@example.com', papel: 'Vendedor', status: 'Ativo' },
  ]
}

function loadUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const initial = seedUsers()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      return initial
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : seedUsers()
  } catch {
    return seedUsers()
  }
}

const users = ref([])

onMounted(() => {
  users.value = loadUsers()
})

function pillClass(type, value) {
  if (type === 'status') {
    return value === 'Ativo'
      ? 'cg-chip'
      : 'cg-chip cg-chip--inactive'
  }

  return value === 'Administrador'
    ? 'cg-chip'
    : 'cg-chip'
}
</script>

<template>
  <NavBar />

  <main class="users-page">
    <section class="users-page__container">
      <header class="users-header">
        <h1 class="users-page__title">Gerenciamento de usuários</h1>

        <RouterLink class="users-newBtn" to="/usuarios/novo">
          Novo Usuário
        </RouterLink>
      </header>

      <section class="cg-table-wrapper">
        <table class="cg-table" v-if="users.length">
          <thead>
            <tr>
              <th class="cg-cell--left">Nome</th>
              <th class="cg-cell--left">Email</th>
              <th class="cg-cell--center">Papel</th>
              <th class="cg-cell--center">Status</th>
              <th class="cg-cell--center cg-th--actions">Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="u in users" :key="u.id">
              <td class="cg-cell--left cg-text--strong">{{ u.nome }}</td>

              <td class="cg-cell--left cg-text--highlight">
                {{ u.email }}
              </td>

              <td class="cg-cell--left">
                <span :class="pillClass('papel', u.papel)">{{ u.papel }}</span>
              </td>

              <td class="cg-cell--left">
                <span :class="pillClass('status', u.status)">{{ u.status }}</span>
              </td>

              <td class="cg-cell--left">
                <RouterLink class="cg-action-link" :to="`/usuarios/${u.id}/editar`">
                  Editar
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-else class="cg-empty">Nenhum usuário encontrado.</p>
      </section>
    </section>
  </main>
</template>

