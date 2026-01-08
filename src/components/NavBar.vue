<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <nav>
        <div class="logo-container">
            <img src="../assets/receipt-black-icon.png" class="logo">
            <h2>CrediGestor</h2>
        </div>
        <div class="links">
            <RouterLink>Dashboard</RouterLink>
            <RouterLink>Promissórias</RouterLink>
            <RouterLink>Clientes</RouterLink>
            <RouterLink>Vendas</RouterLink>
            <RouterLink>Relatórios</RouterLink>
            <RouterLink>Usuários</RouterLink>
        </div>
        <div class="icons">
            <img src="../assets/icone-sino.png">
            <img src="../assets/icone-user.png">
        </div>
    </nav>
</template>

<style scoped>
nav {
    height: 10dvh;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-bottom: solid rgb(221, 221, 221) 1px;
}

nav .logo-container {
    display: flex;
    align-items: center;
}

nav .links a {
    text-decoration: none;
    font-family: 'Inter', sans-serif;
    margin-left: 15px;
    color: #0D121C;
    font-weight: bold;
}

nav .links a:hover {
    border-bottom: solid black 1px;
}

nav .icons img {
    margin-left: 20px;
    cursor: pointer;
}

</style>