<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';

const router = useRouter();
const route = useRoute(); // Usado para pegar o ID da URL

const form = ref({
  full_name: '',
  cpf: '',
  phone: '',
  email: '',
  address: '',
  active: true
});

const loading = ref(true);
const saving = ref(false);
const errorMessage = ref('');

// 1. Carregar os dados atuais do cliente
const fetchClientData = async () => {
  try {
    const apiLink = import.meta.env.VITE_API_URL;
    const customerId = route.params.id; // Pega o ID definido na rota
    const response = await axios.get(`${apiLink}/api/customers/${customerId}`);
    
    // Preenche o formulário com os dados vindos do banco
    form.value = { ...response.data };
  } catch (error) {
    console.error("Erro ao carregar cliente:", error);
    errorMessage.value = "Não foi possível carregar os dados do cliente.";
  } finally {
    loading.value = false;
  }
};

// 2. Enviar a atualização (PUT)
const handleUpdateClient = async () => {
  saving.value = true;
  errorMessage.value = '';
  
  try {
    const apiLink = import.meta.env.VITE_API_URL;
    const customerId = route.params.id;
    
    await axios.put(`${apiLink}/api/customers/${customerId}`, form.value);
    
    // Sucesso: retorna para a listagem
    router.push('/clientes');
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    errorMessage.value = error.response?.data?.detail || "Erro ao atualizar o cliente.";
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchClientData();
});
</script>

<template>
  <Navbar />
  <main class="container">
    <div class="form-wrapper">
      <h1>Editar Cliente</h1>
      
      <div v-if="loading">Carregando dados...</div>
      
      <form v-else @submit.prevent="handleUpdateClient">
        <div class="input-group">
          <label>Nome Completo</label>
          <input type="text" v-model="form.full_name" required>
        </div>

        <div class="input-group">
          <label>CPF/CNPJ</label>
          <input type="text" v-model="form.cpf">
        </div>

        <div class="input-group">
          <label>Telefone</label>
          <input type="tel" v-model="form.phone" required>
        </div>

        <div class="input-group">
          <label>E-mail</label>
          <input type="email" v-model="form.email" required>
        </div>

        <div class="input-group">
          <label>Endereço</label>
          <input type="text" v-model="form.address" required>
        </div>

        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

        <div class="actions">
          <button type="button" @click="router.push('/clientes')" class="btn-cancel">
            Cancelar
          </button>
          <button type="submit" class="btn-save" :disabled="saving">
            {{ saving ? 'Salvando...' : 'Atualizar Cliente' }}
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped>
/* Reutilizando seus estilos do CreateClient */
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
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn-save {
  flex: 2;
  background-color: #125CED;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.btn-cancel {
  flex: 1;
  background-color: #cbd5e0;
  color: #2d3748;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.error-text {
  color: #E53E3E;
  font-size: 0.85rem;
}
</style>