<script setup>
import { ChevronDown } from 'lucide-vue-next';

defineProps({
  options: Array,
  modelValue: [String, Number],
  placeholder: { type: String, default: 'Selecione' }
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="select-wrapper">
    <select 
      :value="modelValue" 
      @change="$emit('update:modelValue', $event.target.value)"
      class="input-field"
      :class="{ 'placeholder-active': !modelValue }"
    >
      <option value="" disabled selected>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.id" :value="opt.id">
        {{ opt.name }}
      </option>
    </select>
    
    <ChevronDown :size="20" class="chevron" />
  </div>
</template>

<style scoped>
.select-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.input-field {
  width: 100%;
  padding: 16px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #374151;
  background-color: #F9FAFB;
  outline: none;
  appearance: none;
  cursor: pointer;
}

.input-field:focus {
  border-color: #2563EB;
  background-color: #fff;
}

.placeholder-active {
  color: #9CA3AF;
}

.chevron {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9CA3AF;
  pointer-events: none;
}
</style>