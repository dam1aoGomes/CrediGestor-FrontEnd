import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)
  const api_link = import.meta.env.VITE_API_URL

  const isAuthenticated = computed(() => !!token.value)

  async function login(email, password) {
    loading.value = true
    error.value = null
    try {
      
      console.log(api_link)
      const response = await axios.post(api_link+'/api/auth/login', {
        email: email,
        password: password
      })

      const { access_token, user_id, user_name, user_role } = response.data
      token.value = access_token

      user.value = {
        id: user_id,
        name: user_name,
        role: user_role
      }

      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('token', access_token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      
      return true
    } catch (err) {
      error.value = err.response?.data?.detail || 'Falha na autenticação'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  return { user, token, loading, error, isAuthenticated, login, logout}
})