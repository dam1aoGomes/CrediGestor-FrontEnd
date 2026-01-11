<script setup>
import { reactive, ref, watch, computed } from 'vue'
import ActionButton from './Button.vue'

const props = defineProps({
  mode: { type: String, default: 'create' },
  clients: { type: Array, default: () => [] },
  initialValues: { type: Object, default: () => ({}) },
  submitting: { type: Boolean, default: false }
})

const emit = defineEmits(['submit', 'cancel'])

const errors = ref({})

const form = reactive({
  clientId: '',
  description: '',
  total: '',
  entry: '',
  installments: 1,
  firstPaymentDate: ''
})

function hydrate(values = {}) {
  form.clientId = values.clientId ?? values.client_id ?? ''
  form.description = values.description ?? ''
  form.total = values.total ?? ''
  form.entry = values.entry ?? ''
  form.installments = values.installments ?? values.parcels ?? 1
  form.firstPaymentDate = values.firstPaymentDate ?? values.first_payment_date ?? ''
  errors.value = {}
}

watch(
  () => props.initialValues,
  (v) => hydrate(v || {}),
  { immediate: true, deep: true }
)

const title = computed(() => (props.mode === 'edit' ? 'Editar venda' : 'Nova venda'))
const submitLabel = computed(() => (props.mode === 'edit' ? 'Salvar alterações' : 'Registrar venda'))

function validate() {
  const e = {}

  if (!form.clientId) e.clientId = 'Selecione um cliente.'
  const total = Number(String(form.total).replace(',', '.'))
  if (!form.total || Number.isNaN(total) || total <= 0) e.total = 'Informe um valor total válido.'

  const entry = form.entry === '' ? 0 : Number(String(form.entry).replace(',', '.'))
  if (Number.isNaN(entry) || entry < 0) e.entry = 'Informe uma entrada válida.'

  const inst = Number(form.installments)
  if (!inst || Number.isNaN(inst) || inst < 1) e.installments = 'Informe o número de parcelas (>= 1).'

  if (!form.firstPaymentDate) e.firstPaymentDate = 'Informe a primeira data de pagamento.'

  errors.value = e
  return Object.keys(e).length === 0
}

function onSubmit() {
  if (!validate()) return

  const payload = {
    client_id: form.clientId,
    description: String(form.description || '').trim(),
    total: Number(String(form.total).replace(',', '.')),
    entry: form.entry === '' ? 0 : Number(String(form.entry).replace(',', '.')),
    installments: Number(form.installments),
    first_payment_date: form.firstPaymentDate
  }

  emit('submit', payload)
}
</script>

<template>
  <main class="sale-page">
    <section class="sale-card">
      <h1>{{ title }}</h1>

      <div class="field">
        <label>Cliente</label>
        <div class="input">
          <select v-model="form.clientId">
            <option value="" disabled>Selecione o Cliente</option>
            <option v-for="c in clients" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>
        </div>
        <p v-if="errors.clientId" class="error">{{ errors.clientId }}</p>
      </div>

      <div class="field">
        <label>Detalhes da venda</label>
        <textarea
          class="textarea"
          v-model="form.description"
          placeholder="Descrição"
          rows="5"
        />
      </div>

      <div class="field">
        <input
          class="text-input"
          v-model="form.total"
          placeholder="Valor total"
          inputmode="decimal"
        />
        <p v-if="errors.total" class="error">{{ errors.total }}</p>
      </div>

      <div class="field">
        <input
          class="text-input"
          v-model="form.entry"
          placeholder="Valor de entrada"
          inputmode="decimal"
        />
        <p v-if="errors.entry" class="error">{{ errors.entry }}</p>
      </div>

      <div class="field">
        <input
          class="text-input"
          v-model.number="form.installments"
          placeholder="Número de Parcelas"
          type="number"
          min="1"
        />
        <p v-if="errors.installments" class="error">{{ errors.installments }}</p>
      </div>

      <div class="field">
        <input
          class="text-input"
          v-model="form.firstPaymentDate"
          placeholder="Primeira data de pagamento"
          type="date"
        />
        <p v-if="errors.firstPaymentDate" class="error">{{ errors.firstPaymentDate }}</p>
      </div>

      <div class="actions">
        <ActionButton
          text="Cancelar"
          variant="secondary"
          :fullWidth="false"
          :disabled="submitting"
          @click="$emit('cancel')"
        />
        <ActionButton
          :text="submitLabel"
          variant="primary"
          :fullWidth="false"
          :disabled="submitting"
          @click="onSubmit"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
.sale-page {
  max-width: 1100px;
  margin: 0 auto;
}

.sale-card {
  max-width: 760px;
  margin: 0 auto;
}

h1 {
  font-size: 2rem;
  margin: 0 0 24px;
  color: #111827;
}

.field {
  margin-bottom: 16px;
}

label {
  display: block;
  font-weight: 600;
  color: #111827;
  margin-bottom: 10px;
}

.input {
  border: 1px solid #CFD6E8;
  border-radius: 10px;
  background: white;
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  width: 100%;
}

select {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.95rem;
  color: #374151;
}

.textarea {
  width: 100%;
  border: 1px solid #CFD6E8;
  border-radius: 10px;
  background: white;
  padding: 14px;
  outline: none;
  font-size: 0.95rem;
  color: #374151;
  resize: none;
}

.text-input {
  width: 100%;
  height: 48px;
  border: 1px solid #CFD6E8;
  border-radius: 10px;
  background: white;
  padding: 0 14px;
  outline: none;
  font-size: 0.95rem;
  color: #374151;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 22px;
}

.error {
  margin-top: 8px;
  font-size: 0.85rem;
  color: #DC2626;
}
</style>