import { defineStore } from 'pinia'
import dashboardService from '../services/dashboard'
import clientesService from '../services/customers.js'

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
      this.isLoading = true
      try {
        const [dashboardRes, clientsRes] = await Promise.all([
          dashboardService.getDashboardData(),
          clientesService.getAll()
        ]);
        const apiData = dashboardRes.data
        const clientsList = clientsRes.data.customers || clientsRes.data || []

        this.stats = {
          total_receber: parseFloat(apiData.total_to_receive), 
          promissorias_atrasadas: parseFloat(apiData.total_overdue), 
          pagamentos_mes: parseFloat(apiData.received_last_30_days),
          proximas_datas: apiData.next_due ? apiData.next_due.length : 0 
        }

        if (apiData.next_due && Array.isArray(apiData.next_due)) {
            this.activities = apiData.next_due.map(item => {
              const foundClient = clientsList.find(c => c.id === item.customer_id);

              return {
                id: item.promissory_note_id,
                client: foundClient ? foundClient.full_name : `Cliente ${item.customer_id}`,
                noteId: item.promissory_note_id,
                value: parseFloat(item.outstanding_balance),
                date: item.due_date,
                status: item.status || 'Pendente'
              }
            })
        }
      } catch (error) {
        console.error('Erro ao buscar dashboard:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
})