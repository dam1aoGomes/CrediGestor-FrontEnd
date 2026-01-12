<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import SaleForm from '../components/vendas/SaleForm.vue'
import { useVendasStore } from '../stores/vendasStore'

const route = useRoute()
const router = useRouter()
const store = useVendasStore()

const saleId = computed(() => String(route.params.id || ''))
const sale = ref(null)

const clients = computed(() => store.clients ?? [])
const submitting = ref(false)

const initialValues = computed(() => {
  const s = sale.value || {}

  return {
    clientId: s.client_id ?? s.customer_id ?? s.clientId ?? '',
    description: s.description ?? '',
    total: s.total ?? '',
    entry: s.entry ?? '',
    installments: s.installments ?? s.parcels ?? 1,
    saleDate: s.sale_date ?? '',
    date: s.sale_date ?? '',

    firstPaymentDate: s.first_payment_date ?? ''
  }
})

onMounted(async () => {
  if (!store.clients?.length && typeof store.fetchClients === 'function') {
    await store.fetchClients()
  }

  sale.value = await store.fetchSaleById(saleId.value)
})

async function handleSubmit(payload) {
  submitting.value = true
  try {
    await store.updateSale(saleId.value, payload)
    router.push('/vendas')
  } finally {
    submitting.value = false
  }
}

function handleCancel() {
  router.push('/vendas')
}
</script>

<template>
  <Navbar />
  <SaleForm
    mode="edit"
    :clients="clients"
    :initialValues="initialValues"
    :submitting="submitting"
    @submit="handleSubmit"
    @cancel="handleCancel"
  />
</template>