import { defineStore } from 'pinia'
import vendasService from '../api/vendasService.js'

export const useVendasStore = defineStore('sales', {
  state: () => ({
    sales: [],
    clients: [
      { id: 1, name: 'Sophia Clark' },
      { id: 2, name: 'Liam Carter' },
      { id: 3, name: 'Olivia Bennett' },
      { id: 4, name: 'Noah Foster' },
      { id: 5, name: 'Ava Harper' }
    ]
  }),
  
  actions: {
    async fetchData() {
      try {
        console.log('Buscando dados de vendas...')
        const response = await vendasService.getSalesData()
        
        this.sales = response.data.sales || [] 
        console.log('Dados carregados:', this.sales)

      } catch (error) {
        console.error('Erro ao buscar dados', error)
      } 
    },

    async fetchSaleById(id) {
      const existingSale = this.sales.find(s => String(s.id) === String(id))
      if (existingSale) return existingSale
      return null
    },

    async createSale(newSaleData) {
      try {
        // const response = await vendasService.create(newSaleData)
        
        const novaVenda = {
          ...newSaleData,
          id: Date.now(), 
          status: 'Ativo',
          client: this.clients.find(c => c.id == newSaleData.clientId)?.name || 'Cliente Desconhecido'
        }
        
        this.sales.push(novaVenda)
        console.log('Venda criada com sucesso:', novaVenda)

      } catch (error) {
        console.error('Erro ao criar venda', error)
        throw error
      }
    },

    async updateSale(id, updatedData) {
      try {
        // await vendasService.update(id, updatedData)

        const index = this.sales.findIndex(s => String(s.id) === String(id))
        if (index !== -1) {
          this.sales[index] = { ...this.sales[index], ...updatedData }
          console.log('Venda atualizada:', this.sales[index])
        }

      } catch (error) {
        console.error('Erro ao atualizar venda', error)
        throw error
      }
    },

    async deleteSale(id) {
      try {
        // await vendasService.delete(id)

        this.sales = this.sales.filter(s => String(s.id) !== String(id))
        console.log('Venda removida ID:', id)

      } catch (error) {
        console.error('Erro ao deletar venda', error)
      }
    }
  }
})