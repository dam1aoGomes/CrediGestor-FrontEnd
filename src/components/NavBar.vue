<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue'

const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
    <nav>
        <div class="logo-container">
            <button class="hamburger" @click="toggleMenu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <img src="../assets/receipt-black-icon.png" class="logo">
            <h2>CrediGestor</h2>
        </div>
        <div class="links" :class="{ open: isOpen }">
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

.hamburger {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    margin-right: 10px;
}

.hamburger span {
    display: block;
    width: 22px;
    height: 2px;
    background: #0D121C;
    margin: 4px 0;
}

@media (max-width: 768px) {
    .links {
        position: absolute;
        top: 64px;
        left: 0;
        width: 100%;
        background: white;
        flex-direction: column;
        padding: 16px;
        display: none;
        border-bottom: 1px solid #E5E7EB;
    }

    .links.open {
        display: flex;
    }

    .hamburger {
        display: block;
    }

    h2 {
        font-size: 1.2rem; 
    }

    .logo {
        width: 2rem;
        height: 2rem;
    }
}
</style>