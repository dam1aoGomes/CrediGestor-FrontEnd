<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'

const STORAGE_KEY = 'cg_users'

function loadUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

const route = useRoute()
const router = useRouter()

const id = computed(() => Number(route.params.id))

const allUsers = ref([])
const notFound = ref(false)

const form = ref({
  nome: '',
  email: '',
  papel: 'Vendedor',
  status: 'Ativo',
})

const errorMsg = ref('')

onMounted(() => {
  allUsers.value = loadUsers()
  const current = allUsers.value.find(u => Number(u.id) === id.value)

  if (!current) {
    notFound.value = true
    return
  }

  form.value = {
    nome: current.nome,
    email: current.email,
    papel: current.papel,
    status: current.status,
  }
})

function validate() {
  errorMsg.value = ''
  if (!form.value.nome?.trim()) return (errorMsg.value = 'Informe o nome.')
  if (!form.value.email?.trim()) return (errorMsg.value = 'Informe o email.')
  if (!form.value.email.includes('@')) return (errorMsg.value = 'Email inválido.')
  return true
}

function onCancel() {
  router.push('/usuarios')
}

function onSave() {
  if (!validate()) return

  const idx = allUsers.value.findIndex(u => Number(u.id) === id.value)
  if (idx === -1) {
    notFound.value = true
    return
  }

  allUsers.value[idx] = {
    ...allUsers.value[idx],
    nome: form.value.nome.trim(),
    email: form.value.email.trim(),
    papel: form.value.papel,
    status: form.value.status,
  }

  saveUsers(allUsers.value)
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
            <input class="user-input" v-model="form.nome" type="text" placeholder="Ex: Sophia Clark" />
          </label>

          <label class="user-label">
            Email
            <input class="user-input" v-model="form.email" type="email" placeholder="exemplo@dominio.com" />
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
          <button class="cg-btn cg-btn--soft" type="button" @click="onCancel">Cancelar</button>
          <button class="cg-btn cg-btn--primary" type="button" @click="onSave">Salvar</button>
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
