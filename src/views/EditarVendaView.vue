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
    clientId: s.client_id ?? s.clientId ?? '',
    description: s.description ?? '',
    total: s.total ?? '',
    entry: s.entry ?? '',
    installments: s.installments ?? s.parcels ?? 1,
    firstPaymentDate: s.first_payment_date ?? ''
  }
})

onMounted(async () => {
  if (typeof store.fetchSaleById === 'function') {
    sale.value = await store.fetchSaleById(saleId.value)
    return
  }

  const found = (store.sales || []).find((x) => String(x.id) === saleId.value)
  sale.value = found || null
})

async function handleSubmit(payload) {
  submitting.value = true
  try {
    if (typeof store.updateSale === 'function') {
      await store.updateSale(saleId.value, payload)
    } else {
      console.warn('Implemente store.updateSale(id, payload) no vendasStore.')
    }

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