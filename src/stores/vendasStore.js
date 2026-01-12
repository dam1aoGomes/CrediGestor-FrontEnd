import { defineStore } from 'pinia'
import vendasService from '../services/sales.js'
import clientesService from '../services/customers.js'

export const useVendasStore = defineStore('sales', {
  state: () => ({
    sales: [],
    clients: [],
    loading: false
  }),
  
  actions: {
    async fetchClients() {
      try {
        const response = await clientesService.getAll()
        const rawClients = response.data.customers || response.data || []

        this.clients = rawClients.map(c => ({
          id: c.id,
          name: c.name || c.full_name || c.username || 'Sem Nome'
        }))
      } catch (error) {
        console.error('Erro ao buscar clientes:', error)
        this.clients = []
      }
    },

    async fetchData() {
      this.loading = true
      try {
        const response = await vendasService.getSalesData()
        const rawSales = response.data.sales || response.data || []

        this.sales = rawSales.map(s => ({
            id: s.id,
            client: s.customer?.name || `Cliente ${s.customer_id}`, 
            description: s.description, 
            total: parseFloat(s.total_amount), 
            entry: parseFloat(s.down_payment || 0),
            date: s.created_at 
                ? new Date(s.created_at).toLocaleDateString('pt-BR') 
                : (s.sale_date || 'Data N/D'),
            status: s.status || 'Ativo'
        }))

      } catch (error) {
        console.error('Erro ao buscar vendas', error)
      } finally {
        this.loading = false
      }
    },

    async createSale(formData) {
      try {
        const payload = {
            customer_id: formData.client_id || formData.clientId, 
            description: formData.description,
            total_amount: parseFloat(formData.total || formData.totalValue),
            down_payment: parseFloat(formData.entry || 0),
            installments_count: parseInt(formData.installments),
            first_installment_date: formData.first_payment_date || formData.firstPaymentDate
        }

        if (!payload.customer_id || !payload.total_amount) {
            console.error("Payload incompleto gerado:", payload)
            throw new Error("Dados obrigatórios (Cliente ou Total) estão faltando ou zerados.")
        }
        await vendasService.create(payload)
        await this.fetchData()
      } catch (error) {
        console.error('Erro ao criar venda na Store', error)
        throw error 
      }
    },

    async updateSale(id, formData) {
      try {
        const payload = {
            customer_id: formData.clientId,
            description: formData.description,
            total_amount: parseFloat(formData.total),
            down_payment: parseFloat(formData.entry || 0),
            installments_count: parseInt(formData.installments),
            first_installment_date: formData.firstPaymentDate
        }
        await vendasService.update(id, payload)
        await this.fetchData()
      } catch (error) {
        console.error('Erro ao atualizar', error)
        throw error
      }
    },

    async deleteSale(id) {
      try {
        await vendasService.delete(id)
        this.sales = this.sales.filter(s => s.id !== id)
      } catch (error) {
        console.error('Erro ao deletar', error)
      }
    },

    async fetchSaleById(id) {
        let sale = this.sales.find(s => String(s.id) === String(id))
        if (!sale) {
            try {
                const response = await vendasService.getSaleById(id)
                const s = response.data
                return {
                    id: s.id,
                    client_id: s.customer_id,
                    description: s.description,
                    total: s.total_amount,
                    entry: s.down_payment,
                    installments: s.installments_count,
                    first_payment_date: s.first_installment_date
                }
            } catch (e) {
                console.error("Venda não encontrada", e)
                return null
            }
        }
        return {
            ...sale,
            client_id: sale.client_id || sale.customer_id || (sale.client ? null : null),
        }
    }
  }
})