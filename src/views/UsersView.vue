<script setup>
import { computed, onMounted } from "vue";
import NavBar from "../components/Navbar.vue";
import { useUsersStore } from "../stores/usersStore";

const store = useUsersStore();

const users = computed(() => store.users);
const loading = computed(() => store.loading);
const error = computed(() => store.error);

onMounted(() => {
  store.fetchUsers();
});

function pillClass(type, value) {
  if (type === "status") {
    return value === "Ativo" ? "cg-chip" : "cg-chip cg-chip--inactive";
  }
  return "cg-chip";
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

      <p v-if="loading" class="cg-empty">Carregando usuários...</p>
      <p v-else-if="error" class="cg-empty">{{ error }}</p>

      <section v-else class="cg-table-wrapper">
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
                <button
                  class="cg-toggle"
                  :class="u.status === 'Ativo' ? 'cg-toggle--on' : 'cg-toggle--off'"
                  type="button"
                  :disabled="loading"
                  @click="store.toggleStatus(u.id)"
                  :title="u.status === 'Ativo' ? 'Clique para inativar' : 'Clique para ativar'"
                >
                  {{ u.status }}
                </button>
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
