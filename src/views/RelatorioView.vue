<script setup>
import { ref, computed } from 'vue'
import NavBar from '../components/NavBar.vue'

const de = ref('')
const ate = ref('')

const mock = [
  { cliente: 'Sophia Carter', email: 'sophia.carter@email.com', total: 1250, parcelasAtrasadas: 2 },
  { cliente: 'Ethan Bennett', email: 'ethan.bennett@email.com', total: 800, parcelasAtrasadas: 1 },
  { cliente: 'Olivia Hayes', email: 'olivia.hayes@email.com', total: 2500, parcelasAtrasadas: 3 },
  { cliente: 'Liam Foster', email: 'liam.foster@email.com', total: 500, parcelasAtrasadas: 1 },
  { cliente: 'Ava Morgan', email: 'ava.morgan@email.com', total: 1800, parcelasAtrasadas: 2 },
]

const linhas = ref([])

const temRelatorio = computed(() => linhas.value.length > 0)

function formatBRL(n) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(n)
    .replace(/\s/g, '')
}

function valorAtualizado(total, parcelasAtrasadas) {
  const taxa = 1 + (parcelasAtrasadas * 0.01)
  return total * taxa
}

function gerarRelatorio() {
  linhas.value = mock.map(r => ({
    ...r,
    atualizado: valorAtualizado(r.total, r.parcelasAtrasadas),
  }))
}

function exportarCSV() {
  const header = ['Cliente', 'Email', 'Total a pagar', 'Parcelas atrasadas', 'Valor atualizado (com taxas)']
  const rows = linhas.value.map(r => ([
    r.cliente,
    r.email,
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

        <button class="cg-btn cg-btn--primary" type="button" @click="gerarRelatorio">
          Gerar Relatório
        </button>
      </section>

      <h2 class="report-sectionTitle">Relatório Gerado</h2>

      <section class="cg-table-wrapper">
        <table class="cg-table" v-if="temRelatorio">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Email</th>
              <th>Total a pagar</th>
              <th>Parcelas atrasadas</th>
              <th>Valor atualizado<br />(com taxas)</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="r in linhas" :key="r.email">
              <td class="cg-cell--left">{{ r.cliente }}</td>
              <td class="cg-cell--left cg-text--muted">{{ r.email }}</td>
              <td class="cg-cell--left cg-text--strong">{{ formatBRL(r.total) }}</td>
              <td class="cg-cell--center">{{ r.parcelasAtrasadas }}</td>
              <td class="cg-cell--left cg-text--strong">{{ formatBRL(r.atualizado) }}</td>
            </tr>
          </tbody>
        </table>

        <p v-else class="cg-empty">Gere um relatório para visualizar os dados.</p>
      </section>

      <div class="report-actions" v-if="temRelatorio">
        <button class="cg-btn cg-btn--soft" type="button" @click="exportarCSV">Exportar</button>
        <button class="cg-btn cg-btn--primary" type="button" @click="imprimir">Imprimir</button>
      </div>
    </section>
  </main>
</template>
