<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';

const router = useRouter();

// Estado do formulário baseado no schema CustomerCreate do FastAPI
const form = ref({
  full_name : '',
  cpf : '',
  phone : '',
  email : '',
  address : '',
  active : '',
  active: true
});

const loading = ref(false);
const errorMessage = ref('');

const handleCreateClient = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const apiLink = import.meta.env.VITE_API_URL;
    
    // A rota POST do back-end espera os dados do cliente
    // O header de Authorization já deve estar configurado no axios pelo seu authStore
    await axios.post(`${apiLink}/api/customers`, form.value);
    
    // Se der certo, volta para a listagem
    router.push('/clientes');
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    errorMessage.value = error.response?.data?.detail || "Erro ao salvar o cliente.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <Navbar />
  <main class="container">
    <div class="form-wrapper">
      <h1>Cadastrar Cliente</h1>
      
      <form @submit.prevent="handleCreateClient">
        <div class="input-group">
          <label>Nome Completo</label>
          <input type="text" v-model="form.full_name" placeholder="Enter full name" required>
        </div>

        <div class="input-group">
          <label>CPF/CNPJ</label>
          <input type="text" v-model="form.cpf" placeholder="Enter CPF/CNPJ">
        </div>

        <div class="input-group">
          <label>Telefone</label>
          <input type="tel" v-model="form.phone" placeholder="Enter phone number" required>
        </div>

        <div class="input-group">
          <label>E-mail</label>
          <input type="email" v-model="form.email" placeholder="Enter email address" required>
        </div>

        <div class="input-group">
          <label>Endereço</label>
          <input type="text" v-model="form.address" placeholder="Enter address" required>
        </div>

        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

        <button type="submit" class="btn-save" :disabled="loading">
          {{ loading ? 'Salvando...' : 'Salvar Cliente' }}
        </button>
      </form>
    </div>
  </main>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 90vh;
  background-color: #f8fafc;
  padding-top: 50px;
}

.form-wrapper {
  width: 100%;
  max-width: 500px;
  text-align: center;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 30px;
  color: #0D121C;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-weight: bold;
  font-size: 0.9rem;
  color: #333;
}

.input-group input {
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  background-color: #EDF2F7;
  font-family: 'Inter', sans-serif;
}

.btn-save {
  margin-top: 10px;
  background-color: #125CED;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-save:hover {
  background-color: #0d4bc7;
}

.btn-save:disabled {
  background-color: #A0AEC0;
  cursor: not-allowed;
}

.error-text {
  color: #E53E3E;
  font-size: 0.85rem;
  margin: 0;
}
</style>