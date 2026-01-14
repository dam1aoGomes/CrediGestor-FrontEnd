<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore()
const router = useRouter()

const isOpen = ref(false)
const isProfileOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const toggleProfile = () => {
  isProfileOpen.value = !isProfileOpen.value
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

function goSettings() {
  router.push("/configuracoes");
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
            <img src="/receipt-black-icon.png" class="logo">
            <h2>CrediGestor</h2>
        </div>

        <div class="links" :class="{ open: isOpen }">
            <RouterLink to="/dashboard">Dashboard</RouterLink>
            <RouterLink to="/promissorias">Promissórias</RouterLink>
            <RouterLink to="/clientes">Clientes</RouterLink>
            <RouterLink to="/vendas">Vendas</RouterLink>
            <RouterLink to="/relatorios">Relatórios</RouterLink>
            <RouterLink to="/usuarios" v-if="authStore.user?.role === 'admin'">Usuários</RouterLink>
        </div>

        <div class="icons">
            <div class="profile-container">
                <img
                    src="../assets/icone-configurações.png"
                    class="settings-icon"
                    alt="Configurações"
                    role="button"
                    tabindex="0"
                    @click="goSettings"
                    @keydown.enter="goSettings"
                />
                <img 
                    src="../assets/icone-user.png" 
                    @click="toggleProfile" 
                    class="user-icon"
                    alt="Menu do Usuário"
                >
                
                <div v-if="isProfileOpen" class="profile-dropdown">
                    <div class="user-info">
                        <p class="name">{{ authStore.user?.name || 'Usuário' }}</p>
                        <p class="role">{{ authStore.user?.role }}</p>
                    </div>
                    <hr>
                    <button @click="handleLogout" class="logout-btn">
                        Sair
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped>

.profile-container {
    position: relative;
    display: flex;
    width: 180px;
    justify-content: flex-end;
    align-items: center;
}

.user-icon {
    cursor: pointer;
    width: 30px;
    height: auto;
}

.settings-icon{
    cursor: pointer;
    height: 22px;
}

.profile-dropdown {
    position: absolute;
    top: 45px;
    right: 0;
    background-color: white;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.1);
    border: 1px solid #ddd;
    border-radius: 8px;
    z-index: 1000;
    padding: 12px;
}

.user-info {
    margin-bottom: 8px;
}

.user-info .name {
    font-weight: bold;
    font-size: 0.9rem;
    color: #333;
    margin: 0;
}

.user-info .role {
    font-size: 0.75rem;
    color: #666;
    margin: 0;
    text-transform: capitalize;
}

hr {
    border: 0;
    border-top: 1px solid #eee;
    margin: 8px 0;
}

.logout-btn {
    width: 100%;
    background: #ff4d4d;
    color: white;
    border: none;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.3s;
}

.logout-btn:hover {
    background: #cc0000;
}

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
  cursor: pointer;
  margin-left: 10px;
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