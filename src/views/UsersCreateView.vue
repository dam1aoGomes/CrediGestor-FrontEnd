<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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

const router = useRouter()

const form = ref({
  nome: '',
  email: '',
  papel: 'Vendedor',
  status: 'Ativo',
})

const errorMsg = ref('')

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

function onCreate() {
  if (!validate()) return

  const users = loadUsers()
  const newUser = {
    id: Date.now(),
    nome: form.value.nome.trim(),
    email: form.value.email.trim(),
    papel: form.value.papel,
    status: form.value.status,
  }

  saveUsers([newUser, ...users])
  router.push('/usuarios')
}
</script>

<template>
  <NavBar />

  <main class="users-page">
    <section class="users-page__container">
      <header class="users-header users-header--stack">
        <h1 class="users-page__title">Novo usuário</h1>
        <p class="users-page__description">Crie um novo usuário para acessar o sistema.</p>
      </header>

      <section class="user-formCard">
        <div class="user-formGrid">
          <label class="user-label">
            Nome
            <input class="user-input" v-model="form.nome" type="text" placeholder="Ex: Maria Silva" />
          </label>

          <label class="user-label">
            Email
            <input class="user-input" v-model="form.email" type="email" placeholder="maria@empresa.com" />
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
          <button class="cg-btn cg-btn--primary" type="button" @click="onCreate">Criar usuário</button>
        </div>
      </section>
    </section>
  </main>
</template>
