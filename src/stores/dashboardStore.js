import { defineStore } from 'pinia'
import dashboardService from '../api/dashboardService.js'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: {
      total_receber: 0,
      promissorias_atrasadas: 0,
      pagamentos_mes: 0,
      proximas_datas: 0
    },
    activities: [], // Vamos preencher com o 'next_due'
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

        // --- 1. TRADUÇÃO DOS CARDS (STATS) ---
        this.stats = {
          // parseFloat remove os zeros à esquerda automaticamente
          total_receber: parseFloat(apiData.total_to_receive), 
          
          // O JSON retornou 'total_overdue' como valor monetário, mas seu card
          // parece esperar uma QUANTIDADE (ex: "5"). Se for dinheiro, use parseFloat.
          promissorias_atrasadas: parseFloat(apiData.total_overdue), 
          
          pagamentos_mes: parseFloat(apiData.received_last_30_days),
          
          // Contamos quantos itens tem na lista para exibir "5 próximas"
          proximas_datas: apiData.next_due ? apiData.next_due.length : 0 
        }

        // --- 2. TRADUÇÃO DA TABELA (ACTIVITIES) ---
        // Mapeamos 'next_due' para o formato que a <RecentActivitiesTable> espera
        if (apiData.next_due && Array.isArray(apiData.next_due)) {
            this.activities = apiData.next_due.map(item => ({
                id: item.promissory_note_id,
                // A API retorna ID 0, vamos tratar isso na visualização
                client: item.customer_id === 0 ? 'Cliente Desconhecido' : `Cliente ${item.customer_id}`,
                noteId: item.promissory_note_id,
                value: parseFloat(item.outstanding_balance), // Limpa os zeros
                date: item.due_date,
                status: item.status || 'Pendente' // Fallback se vier vazio
            }))
        }

        console.log('Dados traduzidos na Store:', this.stats)

      } catch (error) {
        console.error('Erro ao buscar dashboard:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
})

// import { defineStore } from 'pinia'
// import dashboardService from '../api/dashboardService.js'

// export const useDashboardStore = defineStore('dashboard', {
//   state: () => ({
//     stats: null,
//     activities: [],
//   }),
  
//   actions: {
//     async fetchData() {
//       try {
//         const response = await dashboardService.getDashboardData()
        
//         this.stats = response.data.stats
//         this.activities = response.data.activities
//         console.log('Dados do dashboard carregados:', response.data)

//       } catch (error) {
//         console.error('Erro ao buscar dados', error)
//       } 
//     }
//   }
// })