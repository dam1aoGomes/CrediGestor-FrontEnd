<script setup>
defineProps({
  label: String,
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="input-group">
    <textarea
      v-if="type === 'textarea'"
      class="input-field textarea"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      rows="4"
    ></textarea>

    <input
      v-else
      :type="type"
      class="input-field"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<style scoped>
.input-group {
  margin-bottom: 20px;
  width: 100%;
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
  transition: all 0.2s;
}

.input-field:focus {
  border-color: #2563EB;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.textarea {
  resize: vertical;
}

::placeholder {
  color: #9CA3AF;
}
</style>