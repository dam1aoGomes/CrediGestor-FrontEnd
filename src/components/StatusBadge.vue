<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: String
});

const badgeClass = computed(() => {
  return props.status === 'Pago' ? 'badge-paid' : 'badge-pending';
});
</script>

<template>
  <span class="badge" :class="badgeClass">
    {{ status }}
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
</style>