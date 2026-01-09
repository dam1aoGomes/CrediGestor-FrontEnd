<script setup>
import StatusBadge from '../StatusBadge.vue';

defineProps({
  activities: Array
});
</script>

<template>
  <div class="table-container">
    <h3>Atividades recentes</h3>
    
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Nº Promissória</th>
            <th>Valor</th>
            <th>Data de vencimento</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in activities" :key="item.id">
            <td class="client-cell">{{ item.client }}</td>
            <td class="highlight-text">{{ item.noteId }}</td>
            <td class="highlight-text">{{ item.value }}</td>
            <td class="highlight-text">{{ item.date }}</td>
            <td>
              <StatusBadge :status="item.status" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  margin-top: 30px;
}

h3 {
  margin-bottom: 20px;
}

.table-wrapper {
  border: 1px solid #CFD6E8;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

th {
  text-align: left;
  padding: 16px;
  font-weight: 600;
  font-size: 0.9rem;
  background-color: #F9FAFB;
  color: #6B7280;
  border-bottom: 1px solid #E5E7EB;
}

td {
  padding: 16px;
  border-bottom: 1px solid #E5E7EB;
  color: #374151;
  font-size: 0.95rem;
}

tr:last-child td {
  border-bottom: none;
}

.client-cell {
  font-weight: 600;
}

.highlight-text {
  color: #4D6699;
}

.font-bold { 
  font-weight: 600; 
}
</style>