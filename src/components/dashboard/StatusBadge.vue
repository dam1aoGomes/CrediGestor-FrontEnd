<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: String
});

const statusLabel = computed(() => {
  const map = {
    paid: 'Pago',
    pending: 'Pendente',
    overdue: 'Atrasado',
    active: 'Ativo',
    inactive: 'Inativo',
    partial_payment: 'Pagamento Parcial'
  };

  return map[props.status] ?? props.status;
});

const badgeClass = computed(() => {
  if (props.status === 'Pago' || props.status === 'Ativo' || props.status ==='paid') return 'badge-paid';
  if (props.status === 'Pendente' || props.status === 'pending') return 'badge-pending';
  if (props.status === 'Atrasado' || props.status === 'Inativo' || props.status === 'overdue') return 'badge-late';
  if (props.status === 'Pagamento Parcial' || props.status === 'partial_payment') return 'badge-pending';
});
</script>

<template>
  <span class="badge" :class="badgeClass">
    {{ statusLabel }}
  </span>
</template>

<style scoped>
.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-block;
}

.badge-paid {
  background-color: #C9F4C9;
}

.badge-pending {
  background-color: #FEF3C7;
}

.badge-late {
  background-color: #FECACA;
}
</style>