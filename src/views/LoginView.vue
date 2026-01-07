<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const authStore = useAuthStore();

const handleLogin = async () => {
    const success = await authStore.login(email.value,password.value);
    if(success) {
        /**
         * Alterar para /dashboard
        */
        router.push('/');
    }
}
</script>

<template>
<nav>
    <img src="../assets/logo.png">
</nav>
<main>
    <h2>Bem-vindo de volta!</h2>
    <form @submit.prevent="handleLogin">
        <p>E-mail</p>
        <input type="email" name="" id="" v-model="email" required>
        <p>Senha</p>
        <input type="password" name="" id="" v-model="password" required>
        <RouterLink to="/">Esqueceu sua senha?</RouterLink>
        <button type="submit" :disabled="authStore.loading">
            {{ authStore.loading ? 'Entrando...' : 'Login' }}
        </button>
    </form>
    <p v-if="authStore.error" class="error-msg">{{ authStore.error }}</p>
</main>
</template>

<style scoped>
nav {
    height: 10dvh;
    display: flex;
    align-items: center;
    border-bottom: solid rgb(221, 221, 221) 1px;
}

nav img {
    margin-left: 5vw;
}

main {
    display: flex;
    flex-direction: column;
    height: 90dvh;
    align-items: center;
    justify-content: center;
}

main h2 {
    font-family: 'Inter', sans-serif;
}

main form {
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    padding: 50px;
}

main form input {
    margin: 15px 0px;
    padding: 15px;
    width: 300px;
    border-radius: 5px;
    border: solid #CFD6E8 1px;
}

main form a {
    text-decoration: none;
    color: #4D6699;
}

main form button {
    margin-top: 10px;
    background-color: #125CED;
    border: none;
    padding: 10px;
    border-radius: 8px;
    color: white;
}

.error-msg {
    font-family: 'Inter', sans-serif;
    color: red;
}
</style>