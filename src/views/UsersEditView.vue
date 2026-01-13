<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../components/Navbar.vue'
import { useUsersStore } from '../stores/usersStore'

const route = useRoute()
const router = useRouter()
const store = useUsersStore()

const id = computed(() => Number(route.params.id))

const notFound = ref(false)

const form = ref({
  nome: '',
  email: '',
  senha: '',          // ✅ novo (opcional)
  papel: 'Vendedor',
  status: 'Ativo',
})

const errorMsg = ref('')

function validate() {
  errorMsg.value = ''
  if (!form.value.nome?.trim()) return (errorMsg.value = 'Informe o nome.')
  if (!form.value.email?.trim()) return (errorMsg.value = 'Informe o email.')
  if (!form.value.email.includes('@')) return (errorMsg.value = 'Email inválido.')
  // senha opcional: se preencher, valida tamanho
  if (form.value.senha?.trim() && form.value.senha.trim().length < 6) {
    return (errorMsg.value = 'A senha deve ter no mínimo 6 caracteres.')
  }
  return true
}

function onCancel() {
  router.push('/usuarios')
}

onMounted(async () => {
  if (!store.users.length) {
    await store.fetchUsers()
  }

  const current = store.users.find(u => Number(u.id) === id.value)
  if (!current) {
    notFound.value = true
    return
  }

  form.value = {
    nome: current.nome,
    email: current.email,
    senha: '',
    papel: current.papel,
    status: current.status,
  }
})

async function onSave() {
  if (!validate()) return

  const ok = await store.updateUser(id.value, form.value)
  if (!ok) {
    errorMsg.value = store.error || 'Erro ao salvar usuário.'
    return
  }

  router.push('/usuarios')
}
</script>

<template>
  <NavBar />

  <main class="users-page">
    <section class="users-page__container">
      <header class="users-header users-header--stack">
        <h1 class="users-page__title">Editar usuário</h1>
        <p class="users-page__description">Atualize os dados do usuário selecionado.</p>
      </header>

      <section class="user-formCard" v-if="!notFound">
        <div class="user-formGrid">
          <label class="user-label">
            Nome
            <input class="user-input" v-model="form.nome" type="text" placeholder="Ex: Maria Silva" />
          </label>

          <label class="user-label">
            Email
            <input class="user-input" v-model="form.email" type="email" placeholder="exemplo@dominio.com" />
          </label>

          <label class="user-label">
            Nova senha (opcional)
            <input class="user-input" v-model="form.senha" type="password" placeholder="Deixe em branco para manter" />
          </label>

          <label class="user-label">
            Papel
            <select class="user-input" v-model="form.papel">
              <option value="Administrador">Administrador</option>
              <option value="Vendedor">Vendedor</option>
            </select>
          </label>

          <label class="user-label">
            Status
            <select class="user-input" v-model="form.status">
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </label>
        </div>

        <p v-if="errorMsg" class="user-error">{{ errorMsg }}</p>

        <div class="user-actions">
          <button class="cg-btn cg-btn--soft" type="button" @click="onCancel" :disabled="store.loading">
            Cancelar
          </button>
          <button class="cg-btn cg-btn--primary" type="button" @click="onSave" :disabled="store.loading">
            {{ store.loading ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </section>

      <section v-else class="user-formCard">
        <p class="users-empty">Usuário não encontrado.</p>
        <div class="user-actions">
          <button class="cg-btn cg-btn--soft" type="button" @click="onCancel">Voltar</button>
        </div>
      </section>
    </section>
  </main>
</template>
