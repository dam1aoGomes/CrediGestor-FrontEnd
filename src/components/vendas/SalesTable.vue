<script setup>
import StatusBadge from '../StatusBadge.vue'
import { Edit2, Trash2 } from 'lucide-vue-next';

defineProps({
  sales: Array
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Cliente</th>
          <th>CPF</th>
          <th>Total</th>
          <!-- <th>Entrada</th> -->
          <th>Data</th> 
          <th>Status</th>
          <th class="actions-header">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sale in sales" :key="sale.id">
          <td class="client-cell">{{ sale.client }}</td>
          <td class="highlight-text">{{ sale.cpf }}</td>
          <td class="highlight-text">{{ sale.total }}</td>
          <!-- <td>{{ sale.entry || '-' }}</td> -->
          <td class="highlight-text">{{ sale.date }}</td>
          <td><StatusBadge :status="sale.status" /></td>
          <td class="actions-cell">
            <button class="icon-btn edit-btn" @click="$emit('edit', sale)" title="Editar">
              <Edit2 :size="18" />
            </button>
            <button class="icon-btn delete-btn" @click="$emit('delete', sale.id)" title="Excluir">
              <Trash2 :size="18" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrapper {
  background: white;
  border: 1px solid #CFD6E8;
  border-radius: 8px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

th {
  text-align: left;
  padding: 16px;
  background-color: #F9FAFB;
  font-size: 0.85rem;
  color: #6B7280;
  border-bottom: 1px solid #E5E7EB;
}

td {
  padding: 16px;
  border-bottom: 1px solid #E5E7EB;
  color: #374151;
  font-size: 0.9rem;
}

.highlight-text {
  color: #4D6699;
}

.client-cell { 
  font-weight: 600; 
}

.actions-header {
  text-align: center;
}

.actions-cell {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn {
  color: #2563EB;
}

.edit-btn:hover {
  background-color: #EFF6FF;
}

.delete-btn {
  color: #DC2626;
}

.delete-btn:hover {
  background-color: #FEF2F2;
}
</style>