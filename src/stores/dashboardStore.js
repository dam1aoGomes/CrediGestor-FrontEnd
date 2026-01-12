import { defineStore } from 'pinia'
import dashboardService from '../services/dashboard'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: {
      total_receber: 0,
      promissorias_atrasadas: 0,
      pagamentos_mes: 0,
      proximas_datas: 0
    },
    activities: [],
    isLoading: false
  }),
  
  actions: {
    async fetchData() {
      console.log('Buscando dados do dashboard...')
      this.isLoading = true
      try {
        const response = await dashboardService.getDashboardData()
        const apiData = response.data

        console.log('Dados brutos da API:', apiData)

        this.stats = {
          total_receber: parseFloat(apiData.total_to_receive), 
          promissorias_atrasadas: parseFloat(apiData.total_overdue), 
          pagamentos_mes: parseFloat(apiData.received_last_30_days),
          proximas_datas: apiData.next_due ? apiData.next_due.length : 0 
        }

        if (apiData.next_due && Array.isArray(apiData.next_due)) {
            this.activities = apiData.next_due.map(item => ({
                id: item.promissory_note_id,
                client: item.customer_id === 0 ? 'Cliente Desconhecido' : `Cliente ${item.customer_id}`,
                noteId: item.promissory_note_id,
                value: parseFloat(item.outstanding_balance),
                date: item.due_date,
                status: item.status || 'Pendente'
            }))
        }
      } catch (error) {
        console.error('Erro ao buscar dashboard:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
})