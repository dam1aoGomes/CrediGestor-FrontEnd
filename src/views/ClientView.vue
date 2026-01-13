<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';

const clientes = ref([]);
const loading = ref(true);
const search = ref('');

// Função para buscar dados da rota GET que analisamos no FastAPI
const fetchClientes = async () => {
    try {
        const apiLink = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiLink}/api/customers`); // Ajuste o prefixo se necessário
        clientes.value = response.data;
    } catch (error) {
        console.error("Erro ao carregar clientes:", error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchClientes();
});
</script>

<template>
    <Navbar />
    <main class="container">
        <div class="sidebar">
            <h1>Clientes</h1>
            <div class="search-box">
                <input type="text" v-model="search" placeholder="Buscar...">
            </div>
            <RouterLink to="criar-clientes"><button class="btn-add">Adicionar Cliente</button></RouterLink>
        </div>

        <div class="table-container">
            <table v-if="!loading">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>CPF/CNPJ</th>
                        <th>Telefone</th>
                        <th>Email</th>
                        <th>Endereço</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="cliente in clientes" :key="cliente.id">
                        <td>{{ cliente.full_name }}</td>
                        <td>{{ cliente.cpf || '---' }}</td>
                        <td>{{ cliente.phone }}</td>
                        <td>{{ cliente.email }}</td>

                        <td>
                            <RouterLink :to="`/editar-clientes/${cliente.id}`">
                                <button class="btn-edit">Editar</button>
                            </RouterLink>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-else>Carregando clientes...</p>
        </div>
    </main>
</template>

<style scoped>
.container {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 30px;
    padding: 40px;
    background-color: #f8fafc;
    min-height: 90vh;
}

.sidebar h1 {
    font-size: 2rem;
    margin-bottom: 20px;
}

.search-box input {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ddd;
    background-color: #edf2f7;
    margin-bottom: 15px;
}

.btn-add {
    width: 100%;
    background-color: #125ced;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
}

.table-container {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th {
    text-align: left;
    color: #718096;
    font-size: 0.85rem;
    padding: 15px;
    border-bottom: 1px solid #edf2f7;
}

td {
    padding: 15px;
    border-bottom: 1px solid #edf2f7;
    font-size: 0.9rem;
    color: #2d3748;
}

.btn-edit {
    background-color: #edf2f7;
    border: 1px solid #cbd5e0;
    padding: 6px 15px;
    border-radius: 6px;
    cursor: pointer;
}

.btn-edit:hover {
    background-color: #e2e8f0;
}
</style>