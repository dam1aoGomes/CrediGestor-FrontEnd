import { defineStore } from 'pinia'
import vendasService from '../api/vendasService.js'

export const useVendasStore = defineStore('sales', {
  state: () => ({
    sales : [],
  }),
  
  actions: {
    async fetchData() {
      try {
        console.log('Buscando dados de vendas...')
        const response = await vendasService.getSalesData()
        
        this.sales = response.data.sales
        console.log('Dados de vendas carregados:', response.data)

      } catch (error) {
        console.error('Erro ao buscar dados', error)
      } 
    }
  }
})