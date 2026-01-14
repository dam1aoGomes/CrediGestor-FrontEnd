<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';
import { useRouter } from 'vue-router';

// Reutilizando ou criando componentes similares aos de vendas
import SearchInput from '../components/vendas/SearchInput.vue'
import ActionButton from '../components/vendas/Button.vue'
import PaginationControls from '../components/vendas/PaginationControls.vue'

const router = useRouter();
const clientes = ref([]);
const loading = ref(true);

// Estados de filtro e paginação
const searchQuery = ref('');
const page = ref(1);
const perPage = 10;

const fetchClientes = async () => {
    try {
        const apiLink = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiLink}/api/customers`);
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

// Lógica de Busca Automática (Igual a Vendas)
const filteredClientes = computed(() => {
    let list = clientes.value || [];

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        list = list.filter(item => 
            item.full_name.toLowerCase().includes(query) || 
            (item.cpf && item.cpf.includes(query))
        );
    }
    return list;
});

// Lógica de Paginação
const totalPages = computed(() => {
    return Math.max(1, Math.ceil(filteredClientes.value.length / perPage));
});

const paginatedClientes = computed(() => {
    const start = (page.value - 1) * perPage;
    return filteredClientes.value.slice(start, start + perPage);
});

// Resetar página ao buscar
watch(searchQuery, () => {
    page.value = 1;
});

function goToCreate() {
    router.push('/criar-clientes');
}

function prevPage() {
    if (page.value > 1) page.value--;
}

function nextPage() {
    if (page.value < totalPages.value) page.value++;
}
</script>

<template>
    <Navbar />
    <main class="clients-page">
        <aside class="filters-container">
            <h1>Clientes</h1>
            <div class="filter-name">
                <SearchInput 
                    v-model="searchQuery" 
                    placeholder="Pesquisar cliente..." 
                />
            </div>
            
            <div class="new-client-button">
                <ActionButton text="Adicionar Cliente" @click="goToCreate"/>
            </div>
        </aside>

        <section class="content-table">
            <div class="table-container">
                <table v-if="!loading">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>CPF/CNPJ</th>
                            <th>Telefone</th>
                            <th>Email</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="cliente in paginatedClientes" :key="cliente.id">
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
                        <tr v-if="filteredClientes.length === 0">
                            <td colspan="5" style="text-align: center; padding: 20px;">
                                Nenhum cliente encontrado.
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-else class="loading-state">Carregando clientes...</div>
            </div>

            <PaginationControls 
                :page="page" 
                :total="totalPages" 
                @prev="prevPage" 
                @next="nextPage" 
            />
        </section>
    </main>
</template>

<style scoped>
/* Aplicando o Layout Flex da tela de Vendas */
.clients-page {
    display: flex;
    gap: 30px;
    padding: 30px;
    max-width: 1400px;
    margin: 0 auto;
}

.filters-container {
    width: 280px;
    flex-shrink: 0;
}

.content-table {
    flex-grow: 1;
    min-width: 0;
}

h1 {
    font-size: 2rem;
    margin-bottom: 24px;
}

.filter-name {
    margin-bottom: 16px;
}

.table-container {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    overflow-x: auto;
    margin-bottom: 20px;
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
    transition: 0.2s;
}

.btn-edit:hover {
    background-color: #e2e8f0;
}

.loading-state {
    text-align: center;
    padding: 40px;
    color: #718096;
}

@media (max-width: 768px) {
    .clients-page {
        flex-direction: column;
        padding: 16px;
    }
    
    .filters-container {
        width: 100%;
    }
}
</style>