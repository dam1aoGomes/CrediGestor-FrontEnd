<script setup>
import Navbar from '../components/Navbar.vue';
import StatCard from '../components/dashboard/StatCard.vue';
import RecentActivitiesTable from '../components/dashboard/RecentActivitiesTable.vue';
import { onMounted } from 'vue';
import { useDashboardStore } from '../stores/dashboardStore';

const store = useDashboardStore();

onMounted(() => {
  store.fetchData();
});

const formatMoney = (value) => {
  const number = Number(value);
  if (isNaN(number)) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(number);
}

</script>

<template>
  <Navbar />
  <main class="dashboard-container"> 
    <h1>Dashboard</h1>
      <div class="stats-cards">
        <StatCard title="Total a receber" :value="formatMoney(store.stats?.total_receber)" />
        <StatCard title="Promissórias atrasadas" :value="store.stats?.promissorias_atrasadas" />
        <StatCard title="Pagamentos do mês" :value="formatMoney(store.stats?.pagamentos_mes)" />
        <StatCard title="Próximas datas" :value="store.stats?.proximas_datas" />
      </div>

      <RecentActivitiesTable :activities="store.activities" />
    </main>
</template>

<style scoped>
.dashboard-container {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 { 
    font-size: 2rem;
    font-weight: bold;
}

.stats-cards {
    display: flex;
    flex-direction: row;
    gap: 20px;
    margin-top: 20px;
    justify-content: center;
    flex-wrap: wrap;
}

@media (max-width: 768px) {
    .dashboard-container {
        padding: 15px;
    }
}
</style>