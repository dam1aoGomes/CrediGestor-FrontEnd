<script setup>
defineProps({
  text: { type: String, required: true },
  variant: { type: String, default: 'primary' },
  fullWidth: { type: Boolean, default: true },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false }
})

defineEmits(['click'])
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['btn', `btn-${variant}`, { 'btn-full': fullWidth }]"
    @click="$emit('click', $event)"
  >
    {{ text }}
  </button>
</template>

<style scoped>
.btn {
  padding: 12px 20px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s, opacity 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-full { width: 100%; }

.btn-primary {
  background-color: #125CED;
  color: white;
}
.btn-primary:hover:not(:disabled) {
  background-color: #0F4FCC;
}

.btn-secondary {
  background-color: #E5E7EB;
  border-color: #E5E7EB;
  color: #111827;
}
.btn-secondary:hover:not(:disabled) {
  background-color: #D1D5DB;
  border-color: #D1D5DB;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>