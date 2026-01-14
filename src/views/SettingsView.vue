<script setup>
import { computed, onMounted, reactive, watch } from "vue";
import NavBar from "../components/NavBar.vue";
import { useSystemConfigStore } from "../stores/systemConfigStore";

const store = useSystemConfigStore();

const loading = computed(() => store.loading);
const saving = computed(() => store.saving);
const exporting = computed(() => store.exporting);
const error = computed(() => store.error);
const config = computed(() => store.config);

const form = reactive({
  company_name: "",
  logo_url: "",
  monthly_interest_rate: 0,
  fine_rate: 0,
  days_before_due_alert: 0,
});

onMounted(async () => {
  await store.fetchConfig();
});

watch(
  () => store.config,
  (c) => {
    form.company_name = c.company_name ?? "";
    form.logo_url = c.logo_url ?? "";
    form.monthly_interest_rate = c.monthly_interest_rate ?? 0;
    form.fine_rate = c.fine_rate ?? 0;
    form.days_before_due_alert = c.days_before_due_alert ?? 0;
  },
  { deep: true, immediate: true }
);

async function onSave() {
  await store.saveConfig(form);
}

async function onExport() {
  await store.exportBackup();
}
</script>

<template>
  <NavBar />

  <main class="settings-page">
    <section class="settings-page__container">
      <header class="settings-header">
        <h1 class="settings-page__title">Configurações do sistema</h1>

        <button
          class="settings-exportBtn"
          type="button"
          :disabled="loading || exporting"
          @click="onExport"
          :title="exporting ? 'Exportando...' : 'Gerar e baixar backup'"
          
        >
          {{ exporting ? "Exportando..." : "Exportar Backup" }}
        </button>
      </header>

      <p v-if="loading" class="cg-empty">Carregando configurações...</p>
      <p v-else-if="error" class="cg-empty">{{ error }}</p>

      <section v-else class="settings-card">
        <div class="settings-grid">
          <label class="settings-field">
            <span class="settings-label">Nome da empresa</span>
            <input
              class="settings-input"
              v-model="form.company_name"
              type="text"
              placeholder="Ex.: CrediGestor"
            />
          </label>

          <label class="settings-field">
            <span class="settings-label">URL do logo</span>
            <input
              class="settings-input"
              v-model="form.logo_url"
              type="text"
              placeholder="https://..."
            />
          </label>

          <label class="settings-field">
            <span class="settings-label">Juros ao mês (%)</span>
            <input
              class="settings-input"
              v-model.number="form.monthly_interest_rate"
              type="number"
              step="0.01"
              min="0"
            />
          </label>

          <label class="settings-field">
            <span class="settings-label">Multa (%)</span>
            <input
              class="settings-input"
              v-model.number="form.fine_rate"
              type="number"
              step="0.01"
              min="0"
            />
          </label>

          <label class="settings-field">
            <span class="settings-label">Dias antes do vencimento (alerta)</span>
            <input
              class="settings-input"
              v-model.number="form.days_before_due_alert"
              type="number"
              step="1"
              min="0"
            />
          </label>
        </div>

        <div class="settings-actions">
          <button
            class="settings-saveBtn"
            type="button"
            :disabled="saving || loading"
            @click="onSave"
          >
            {{ saving ? "Salvando..." : "Salvar Configurações" }}
          </button>

          <small class="settings-meta" v-if="config.updated_at">
            Última atualização: {{ new Date(config.updated_at).toLocaleString() }}
          </small>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
.settings-page {
  padding: 24px;
}

.settings-page__container {
  max-width: 980px;
  margin: 0 auto;
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.settings-page__title {
  font-size: 1.4rem;
  font-weight: 700;
}

.cg-empty {
  padding: 14px;
  border-radius: 10px;
  background: #f7f7f7;
}

.settings-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 18px;
}

.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.settings-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.settings-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #444;
}

.settings-input {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px 12px;
  outline: none;
}

.settings-input:focus {
  border-color: #bbb;
}

.settings-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
}

.settings-saveBtn,
.settings-exportBtn {
  border: 0;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
}

.settings-saveBtn:disabled,
.settings-exportBtn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.settings-saveBtn {
  background: #111827;
  color: white;
}

.settings-exportBtn {
  background: #e5e7eb;
  color: #111827;
}

.settings-meta {
  color: #666;
}

@media (max-width: 720px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .settings-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
