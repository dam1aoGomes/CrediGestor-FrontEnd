import { defineStore } from 'pinia'
import vendasService from '../services/sales.js'
import clientesService from '../services/customers.js'

function toISODate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

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

        this.sales = rawSales.map(s => {
          const saleDateRaw = s.first_installment_date || s.created_at || null

          return {
            id: s.id,

            customer_id: s.customer_id,
            client_id: s.customer_id,
            sale_date: toISODate(saleDateRaw),
            first_installment_date: toISODate(s.first_installment_date),

            client: s.customer?.name || `Cliente ${s.customer_id}`,
            description: s.description || '',
            total: parseFloat(s.total_amount) || 0,
            entry: parseFloat(s.down_payment || 0) || 0,
            date: saleDateRaw
              ? new Date(saleDateRaw).toLocaleDateString('pt-BR')
              : 'Data N/D',
            status: s.status || 'Ativo',

            installments: s.installments_count ?? 1
          }
        })
      } catch (error) {
        console.error('Erro ao buscar vendas', error)
      } finally {
        this.loading = false
      }
    },

    async createSale(formData) {
      try {
        const payload = {
          customer_id: formData.clientId || formData.client_id,
          description: formData.description,
          total_amount: parseFloat(formData.total || formData.totalValue),
          down_payment: parseFloat(formData.entry || 0),
          installments_count: parseInt(formData.installments),
          first_installment_date: formData.firstPaymentDate || formData.first_payment_date
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
          customer_id: formData.clientId || formData.client_id || formData.customer_id,
          description: formData.description,
          total_amount: parseFloat(formData.total),
          down_payment: parseFloat(formData.entry || 0),
          installments_count: parseInt(formData.installments),
          first_installment_date: formData.firstPaymentDate || formData.first_payment_date
        }

        const saleDate = formData.saleDate || formData.date || formData.sale_date
        if (saleDate) payload.sale_date = saleDate

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
      try {
        const response = await vendasService.getSaleById(id)

        const s = response.data.sale || response.data

        const saleDateRaw = s.sale_date || s.created_at || null

        return {
          id: s.id,
          client_id: s.customer_id,
          customer_id: s.customer_id,

          description: s.description || '',
          total: s.total_amount ?? '',
          entry: s.down_payment ?? '',
          installments: s.installments_count ?? 1,

          sale_date: toISODate(saleDateRaw),
          first_payment_date: toISODate(s.first_installment_date)
        }
      } catch (e) {
        console.error('Venda não encontrada', e)
        return null
      }
    }
  }
})