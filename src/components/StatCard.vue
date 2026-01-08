<script setup>
defineProps({
  title: String,
  value: String
})
</script>

<template>
    <div class="stat-card">
        <h3>{{ title }}</h3> 
        <p>{{ value }}</p>
    </div>
</template>

<style scoped>
    .stat-card {
        background-color: #E8EBF2;
        border-radius: 8px;
        padding: 30px;
        text-align: left; 
        min-width: 220px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .stat-card h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: normal;
    }
    .stat-card p {
        font-weight: bold;
        margin: 10px 0 0;
        font-size: 1.8em;
    }
</style>