<script setup>
import { ref, computed, watch } from 'vue'
import NavBar from '../components/NavBar.vue'

const notas = ref([
  { id: 12345, cliente: 'Sarah Johnson', valor: 500, vencimento: '2024-08-15', status: 'Pendente' },
  { id: 67890, cliente: 'Michael Brown', valor: 1200, vencimento: '2024-07-20', status: 'Pago' },
  { id: 11223, cliente: 'Emily Davis', valor: 800, vencimento: '2024-06-30', status: 'Atrasado' },
  { id: 44556, cliente: 'David Wilson', valor: 300, vencimento: '2024-09-05', status: 'Pendente' },
  { id: 44557, cliente: 'Ethan Carter', valor: 400, vencimento: '2024-09-05', status: 'Pendente' },
  { id: 77889, cliente: 'Jessica Lee', valor: 1500, vencimento: '2024-08-25', status: 'Pendente' },
])

const statusFiltro = ref('')
const clienteFiltro = ref('')
const vencimentoOrdem = ref('')

const page = ref(1)
const perPage = 6

const clientes = computed(() => {
  return Array.from(new Set(notas.value.map(n => n.cliente))).sort()
})

const notasFiltradas = computed(() => {
  let lista = [...notas.value]

  if (statusFiltro.value) {
    lista = lista.filter(n => n.status === statusFiltro.value)
  }

  if (clienteFiltro.value) {
    lista = lista.filter(n => n.cliente === clienteFiltro.value)
  }

  if (vencimentoOrdem.value === 'asc') {
    lista.sort((a, b) => a.vencimento.localeCompare(b.vencimento))
  } else if (vencimentoOrdem.value === 'desc') {
    lista.sort((a, b) => b.vencimento.localeCompare(a.vencimento))
  }

  return lista
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(notasFiltradas.value.length / perPage))
})

const notasPaginadas = computed(() => {
  const start = (page.value - 1) * perPage
  return notasFiltradas.value.slice(start, start + perPage)
})

watch([statusFiltro, clienteFiltro, vencimentoOrdem], () => {
  page.value = 1
})

function prevPage() {
  if (page.value > 1) page.value--
}

function nextPage() {
  if (page.value < totalPages.value) page.value++
}

function formatBRL(n) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(n)
    .replace(/\s/g, '')
}

function badgeClass(status) {
  const s = String(status || '').toLowerCase()
  if (s === 'pago') return 'cg-chip cg-chip--success'
  if (s === 'atrasado') return 'cg-chip cg-chip--danger'
  return 'cg-chip cg-chip--warning'
}
</script>

<template>
  <NavBar />

  <main class="notes-page">
    <section class="notes-page__container">
      <h1 class="notes-page__title">Notas Promissórias</h1>
      <p class="notes-page__description">
        Gerencie todas as notas promissórias, incluindo filtro por status, cliente e data de vencimento.
      </p>

      <div class="notes-filters">
        <select v-model="statusFiltro" class="notes-filter">
          <option value="">Status</option>
          <option value="Pendente">Pendente</option>
          <option value="Pago">Pago</option>
          <option value="Atrasado">Atrasado</option>
        </select>

        <select v-model="clienteFiltro" class="notes-filter">
          <option value="">Cliente</option>
          <option v-for="c in clientes" :key="c" :value="c">{{ c }}</option>
        </select>

        <select v-model="vencimentoOrdem" class="notes-filter">
          <option value="">Data de Vencimento</option>
          <option value="asc">Mais antigo primeiro</option>
          <option value="desc">Mais recente primeiro</option>
        </select>
      </div>

      <section class="cg-table-wrapper">
        <table class="cg-table" v-if="notasPaginadas.length">
          <thead>
            <tr>
              <th class="cg-cell--left">Note ID</th>
              <th class="cg-cell--left">Cliente</th>
              <th class="cg-cell--left">Valor</th>
              <th class="cg-cell--left">Vencimento</th>
              <th class="cg-cell--left">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="n in notasPaginadas" :key="n.id">
              <td class="cg-cell--left cg-text--muted">#{{ n.id }}</td>
              <td class="cg-cell--left cg-text--highlight">{{ n.cliente }}</td>
              <td class="cg-cell--left cg-text--highlight">{{ formatBRL(n.valor) }}</td>
              <td class="cg-cell--left cg-text--highlight">{{ n.vencimento }}</td>
              <td class="cg-cell--left">
                <span :class="badgeClass(n.status)">{{ n.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-else class="cg-empty">Nenhuma promissória encontrada.</p>
      </section>

      <div class="notes-pagination">
        <button
          class="notes-pagination__btn"
          type="button"
          @click="prevPage"
          :disabled="page === 1"
          aria-label="Anterior"
        >
          ‹
        </button>

        <button
          class="notes-pagination__btn"
          type="button"
          @click="nextPage"
          :disabled="page === totalPages"
          aria-label="Próximo"
        >
          ›
        </button>
      </div>
    </section>
  </main>
</template>
