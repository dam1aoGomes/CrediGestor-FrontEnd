<script setup>
import { ref, computed, watch } from 'vue'
import NavBar from '../components/NavBar.vue'
import { useDelinquencyReportStore } from '../stores/reportStore'
import PaginationControls from '../components/vendas/PaginationControls.vue'

const store = useDelinquencyReportStore()

const de = ref('')
const ate = ref('')

const loading = computed(() => store.loading)
const error = computed(() => store.error)

function toDateOnly(d) {
  return d ? String(d).slice(0, 10) : ''
}

function inRange(dueDate) {
  const d = toDateOnly(dueDate)
  if (!d) return false

  const hasDe = !!de.value
  const hasAte = !!ate.value
  if (!hasDe && !hasAte) return true

  if (hasDe && d < de.value) return false
  if (hasAte && d > ate.value) return false
  return true
}

const linhasFiltradas = computed(() => {
  const base = store.linhas || []

  if (!de.value && !ate.value) return base

  const toDateOnly = (d) => (d ? String(d).slice(0, 10) : "")

  const inRange = (dueDate) => {
    const d = toDateOnly(dueDate)
    if (!d) return false
    if (de.value && d < de.value) return false
    if (ate.value && d > ate.value) return false
    return true
  }

  return base
    .map((c) => {
      const installments = Array.isArray(c.installments) ? c.installments : []
      const filteredInst = installments.filter((i) => inRange(i.due_date))

      if (!filteredInst.length) return null

      const parcelasAtrasadas = filteredInst.filter((i) => Number(i.days_overdue || 0) > 0).length

      const total = filteredInst.reduce((sum, i) => {
        const bal = Number(String(i.outstanding_balance ?? '').replace(/[^0-9.-]/g, ''))
        if (Number.isFinite(bal) && bal !== 0) return sum + bal

        const orig = Number(String(i.original_amount ?? '').replace(/[^0-9.-]/g, '')) || 0
        const paid = Number(String(i.paid_amount ?? '').replace(/[^0-9.-]/g, '')) || 0
        return sum + Math.max(0, orig - paid)
      }, 0)

      const atualizado = total * (1 + parcelasAtrasadas * 0.01)

      return {
        ...c,
        parcelasAtrasadas,
        total,
        atualizado,
        installments: filteredInst,
      }
    })
    .filter(Boolean)
})


const temRelatorio = computed(() => linhasFiltradas.value.length > 0)

const page = ref(1)
const perPage = 8

const totalItems = computed(() => Array.isArray(linhasFiltradas.value) ? linhasFiltradas.value.length : 0)

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(totalItems.value / perPage))
})

const linhasPaginadas = computed(() => {
  const start = (page.value - 1) * perPage
  return linhasFiltradas.value.slice(start, start + perPage)
})

watch([de, ate], () => {
  page.value = 1
})

watch(totalPages, (tp) => {
  if (page.value > tp) page.value = tp
})

function prevPage() {
  if (page.value > 1) page.value--
}

function nextPage() {
  if (page.value < totalPages.value) page.value++
}

const showingFrom = computed(() => {
  if (!totalItems.value) return 0
  return (page.value - 1) * perPage + 1
})
const showingTo = computed(() => {
  return Math.min(page.value * perPage, totalItems.value)
})

function formatBRL(n) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(Number(n || 0))
    .replace(/\s/g, '')
}

async function gerarRelatorio() {
  await store.generate({ de: de.value, ate: ate.value })
  page.value = 1
}

function exportarCSV() {
  const header = ['Cliente', 'Telefone', 'Total a pagar', 'Parcelas atrasadas', 'Valor atualizado (com taxas)']
  const rows = linhasFiltradas.value.map(r => ([
    r.cliente,
    r.telefone,
    formatBRL(r.total),
    String(r.parcelasAtrasadas),
    formatBRL(r.atualizado),
  ]))

  const csv = [header, ...rows]
    .map(cols => cols.map(v => `"${String(v).replaceAll('"', '""')}"`).join(';'))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'relatorio-clientes-atraso.csv'
  a.click()

  URL.revokeObjectURL(url)
}

function imprimir() {
  window.print()
}
</script>

<template>
  <NavBar />

  <main class="report-page">
    <section class="report-page__container">
      <h1 class="report-page__title">Relatório de Clientes com Atraso</h1>
      <p class="report-page__description">
        Gere um relatório de clientes com pagamentos atrasados.
      </p>

      <section class="report-block">
        <h2 class="report-block__title">Intervalo de datas</h2>

        <div class="report-form">
          <div class="report-field">
            <label class="report-label" for="de">De</label>
            <input id="de" class="report-input" type="date" v-model="de" />
          </div>

          <div class="report-field">
            <label class="report-label" for="ate">Até</label>
            <input id="ate" class="report-input" type="date" v-model="ate" />
          </div>
        </div>

        <button class="cg-btn cg-btn--primary" type="button" @click="gerarRelatorio" :disabled="loading">
          {{ loading ? 'Gerando...' : 'Gerar Relatório' }}
        </button>
      </section>

      <h2 class="report-sectionTitle">Relatório Gerado</h2>

      <p v-if="error" class="cg-empty">{{ error }}</p>

      <section class="cg-table-wrapper">
        <table class="cg-table" v-if="temRelatorio">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Telefone</th>
              <th>Total a pagar</th>
              <th>Parcelas atrasadas</th>
              <th>Valor atualizado<br />(com taxas)</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="r in linhasPaginadas" :key="r.customerId">
              <td class="cg-cell--left">{{ r.cliente }}</td>
              <td class="cg-cell--left cg-text--muted">{{ r.telefone || '—' }}</td>
              <td class="cg-cell--left cg-text--strong">{{ formatBRL(r.total) }}</td>
              <td class="cg-cell--center">{{ r.parcelasAtrasadas }}</td>
              <td class="cg-cell--left cg-text--strong">{{ formatBRL(r.atualizado) }}</td>
            </tr>
          </tbody>
        </table>

        <p v-else class="cg-empty">Gere um relatório para visualizar os dados.</p>
      </section>

      <div v-if="temRelatorio" class="report-footer">
        <p class="report-footer__info">
          Mostrando {{ showingFrom }}–{{ showingTo }} de {{ totalItems }}
        </p>
      </div>

      <PaginationControls
        :page="page"
        :total="totalPages"
        @prev="prevPage"
        @next="nextPage"
      />

      <div class="report-actions" v-if="temRelatorio">
        <button class="cg-btn cg-btn--soft" type="button" @click="exportarCSV">Exportar</button>
        <button class="cg-btn cg-btn--primary" type="button" @click="imprimir">Imprimir</button>
      </div>
    </section>
  </main>
</template>
