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

      <section class="report-card">
        <table class="report-table" v-if="temRelatorio">
          <thead class="report-table__head">
            <tr class="report-table__row report-table__row--head">
              <th class="report-table__th">Cliente</th>
              <th class="report-table__th">Email</th>
              <th class="report-table__th">Total a pagar</th>
              <th class="report-table__th">Parcelas atrasadas</th>
              <th class="report-table__th">Valor atualizado<br />(com taxas)</th>
            </tr>
          </thead>

          <tbody class="report-table__body">
            <tr
              v-for="(r, idx) in linhas"
              :key="r.email"
              :class="[
                'report-table__row',
                idx === linhas.length - 1 ? 'report-table__row--last' : ''
              ]"
            >
              <td class="report-table__cell">{{ r.cliente }}</td>
              <td class="report-table__cell report-table__cell--link">{{ r.email }}</td>
              <td class="report-table__cell report-table__cell--link">{{ formatBRL(r.total) }}</td>
              <td class="report-table__cell report-table__cell--link">{{ r.parcelasAtrasadas }}</td>
              <td class="report-table__cell report-table__cell--link">{{ formatBRL(r.atualizado) }}</td>
            </tr>
          </tbody>
        </table>

        <p v-else class="report-empty">Gere um relatório para visualizar os dados.</p>
      </section>

      <div class="report-actions" v-if="temRelatorio">
        <button class="cg-btn cg-btn--soft" type="button" @click="exportarCSV">Exportar</button>
        <button class="cg-btn cg-btn--primary" type="button" @click="imprimir">Imprimir</button>
      </div>
    </section>
  </main>
</template>
