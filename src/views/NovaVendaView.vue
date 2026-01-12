<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import { useVendasStore } from '../stores/vendasStore'
import SaleForm from '../components/vendas/SaleForm.vue'

const router = useRouter()
const store = useVendasStore()

const clients = computed(() => store.clients ?? [])

const submitting = ref(false)

async function handleSubmit(payload) {
  submitting.value = true
  try {
    console.log("payload", payload)

    await store.createSale(payload)
    router.push('/vendas')
  } catch (error) {
    console.error("Erro ao criar venda:", error)
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
  <div class="form-container">
    <SaleForm
      mode="create"
      :clients="clients"
      :submitting="submitting"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped>
  .form-container {
    padding: 30px;
    max-width: 1200px;
    margin: 0 auto;
  }
</style>