<script setup>
defineProps({
  text: String,
  variant: {
    type: String,
  }
})
</script>

<template>
  <button :class="['btn', `btn-${variant}`]">
    {{ text }}
  </button>
</template>

<style scoped>
.btn {
  width: 100%;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: opacity 0.2s;
  background-color: #125CED;
  color: white;
}

.btn:hover {
  background-color: #E5E7EB;
  border: 2px solid #125CED;
  color: #125CED;
}
</style>