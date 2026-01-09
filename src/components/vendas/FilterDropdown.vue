<script setup>
import { ChevronDown } from 'lucide-vue-next';

defineProps({
  label: String,
  options: Array,
  modelValue: String
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="filter-wrapper">
    <span class="label">{{ label }}</span>
    
    <select 
      :value="modelValue" 
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="" disabled selected>Selecione</option>
      <option v-for="opt in options" :key="opt" :value="opt">
        {{ opt }}
      </option>
    </select>
    <ChevronDown :size="16" class="chevron" />
  </div>
</template>

<style scoped>
.filter-wrapper {
  position: relative;
  background-color: #E5E7EB;
  border-radius: 8px;
  padding: 0 16px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 100px;
  cursor: pointer;
}

.label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
}

select {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.chevron {
  width: 16px;
  height: 16px;
  color: #4B5563;
}
</style>