<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import SearchInput from '../components/vendas/SearchInput.vue'
import FilterSelect from '../components/vendas/FilterDropdown.vue'
import ActionButton from '../components/vendas/Button.vue'
import PaginationControls from '../components/vendas/PaginationControls.vue'
import SalesTable from '../components/vendas/SalesTable.vue'
import { useVendasStore } from '../stores/vendasStore';

const store = useVendasStore();

onMounted(() => {
  store.fetchData();
});

const salesData = computed(() => store.sales)

const searchQuery = ref('')
const dateFilter = ref('')
const statusFilter = ref('')

const page = ref(1)
const perPage = 10

const filteredSales = computed(() => {
  let list = salesData.value

  if (statusFilter.value === 'Ativo' || statusFilter.value === 'Inativo') {
    list = list.filter(item => item.status === statusFilter.value)
  }

  if (dateFilter.value === 'Mais antigo') {
    list.sort((a, b) => a.date.localeCompare(b.date))
  } else if (dateFilter.value === 'Mais recente') {
    list.sort((a, b) => b.date.localeCompare(a.date))
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(item => item.client.toLowerCase().includes(query))
  }

  return list
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredSales.value.length / perPage))
})

const paginatedSales = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredSales.value.slice(start, start + perPage)
})

watch([statusFilter, searchQuery], () => {
  page.value = 1
})

function prevPage() {
  if (page.value > 1) page.value--
}

function nextPage() {
  if (page.value < totalPages.value) page.value++
}

</script>

<template>
  <Navbar />
  <main class="sales-page">
    <aside class="filters-container">
      <h1>Vendas</h1>
      <div class="filter-name">
        <SearchInput 
          v-model="searchQuery" 
          placeholder="Pesquisar cliente..." 
        />
      </div>
      <div class="row-filters">
        <FilterSelect 
          label="Data" 
          :options="['Mais antigo', 'Mais recente']" 
          v-model="dateFilter"
        />
        <FilterSelect 
          label="Status" 
          :options="['Todos','Ativo', 'Inativo']" 
          v-model="statusFilter"
        />
      </div>

      <div class="new-sale-button">
        <ActionButton text="Nova Venda" />
      </div>
    </aside>
    <section class="content-table">
      <SalesTable :sales="paginatedSales" />
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
.sales-page {
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

.filter-name, .row-filters, .action-area {
  margin-bottom: 16px;
}

.row-filters {
  display: flex;
  gap: 15px;
}

@media (max-width: 768px) {
  .sales-page {
    flex-direction: column;
    padding: 16px;
  }
  
  .sidebar-filters {
    width: 100%;
  }
}
</style>