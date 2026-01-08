import { defineStore } from 'pinia'
import dashboardService from '../api/dashboardService.js'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: null,
    activities: [],
  }),
  
  actions: {
    async fetchData() {
      try {
        const response = await dashboardService.getDashboardData()
        
        this.stats = response.data.stats
        this.activities = response.data.activities
        console.log('Dados do dashboard carregados:', response.data)

      } catch (error) {
        console.error('Erro ao buscar dados', error)
      } 
    }
  }
})