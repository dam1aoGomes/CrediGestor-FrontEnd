<script setup>
import { Search } from 'lucide-vue-next';

defineProps(['modelValue', 'placeholder'])
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="search-wrapper">
    <Search class="icon" :size="20" />   
    <input 
      type="text" 
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<style scoped>
.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #F3F4F6;
  border-radius: 8px;
  padding: 0 12px;
  height: 48px;
}

.icon {
  width: 20px;
  height: 20px;
  color: #9CA3AF;
  margin-right: 10px;
}

input {
  border: none;
  background: transparent;
  width: 100%;
  height: 100%;
  font-family: 'Inter', sans-serif;
  color: #374151;
  outline: none;
  font-size: 0.95rem;
}

input::placeholder {
  color: #9CA3AF;
}
</style>