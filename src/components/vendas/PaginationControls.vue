<script setup>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

defineProps(['page', 'total'])
defineEmits(['prev', 'next'])
</script>

<template>
  <div class="pagination">
    <button @click="$emit('prev')" :disabled="page <= 1">
      <ChevronLeft :size="20" />
    </button>
    <button @click="$emit('next')" :disabled="page >= total">
      <ChevronRight :size="20" />
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  color: #374151;
  transition: background 0.2s;
}

button:hover:not(:disabled) {
  background-color: #E5E7EB;
}

button:disabled {
  color: #D1D5DB;
  cursor: not-allowed;
}
</style>