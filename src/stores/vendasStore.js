import { defineStore } from 'pinia'
import vendasService from '../services/sales.js'
import clientesService from '../services/customers.js'

function parseCurrency(value) {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  
  const cleanStr = String(value)
    .replace(/[R$\s]/g, '')    
    .replace(/\./g, '')        
    .replace(',', '.');        

  const number = parseFloat(cleanStr);
  return isNaN(number) ? 0 : number;
}

function parseDate(value) {
  if (!value) return null;
  if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return value;
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function formatDateBr(dateString) {
  if (!dateString) return 'Data N/D';
  const datePart = String(dateString).split('T')[0];
  const parts = datePart.split('-');
  
  if (parts.length !== 3) return datePart;
  
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
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
          name: c.full_name || 'Sem Nome'
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
          const foundClient = this.clients.find(c => c.id === s.customer_id);

          return {
            id: s.id,
            customer_id: s.customer_id,
            client_id: s.customer_id,
            sale_date: saleDateRaw ? String(saleDateRaw).split('T')[0] : '',
            first_installment_date: parseDate(s.first_installment_date),
            client: foundClient ? foundClient.name : (s.customer?.full_name || `Cliente ${s.customer_id}`),
            description: s.description || '',
            total: parseFloat(s.total_amount) || 0,
            entry: parseFloat(s.down_payment || 0) || 0,
            date: formatDateBr(saleDateRaw),
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
        const totalAmount = parseCurrency(formData.total || formData.totalValue);
        const downPayment = parseCurrency(formData.entry);
        const firstPaymentDate = formData.firstPaymentDate || formData.first_payment_date;

        const payload = {
          customer_id: formData.clientId || formData.client_id,
          description: formData.description,
          total_amount: totalAmount,
          down_payment: downPayment,
          installments_count: parseInt(formData.installments),
          first_installment_date: firstPaymentDate
        }

        if (!payload.customer_id || payload.total_amount <= 0) {
            console.error("Payload incompleto ou zerado:", payload)
            throw new Error("Dados obrigatórios inválidos.")
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
        const totalAmount = parseCurrency(formData.total);
        const downPayment = parseCurrency(formData.entry);
        const firstPaymentDate = parseDate(formData.firstPaymentDate || formData.first_payment_date);

        const payload = {
          customer_id: formData.clientId || formData.client_id || formData.customer_id,
          description: formData.description,
          total_amount: totalAmount,
          down_payment: downPayment,
          installments_count: parseInt(formData.installments),
          first_installment_date: firstPaymentDate
        }

        const saleDate = formData.saleDate || formData.date || formData.sale_date
        if (saleDate) payload.sale_date = parseDate(saleDate)

        await vendasService.update(id, payload)
        await this.fetchData()
      } catch (error) {
        console.error('Erro ao atualizar', error)
        if (error.response?.data) {
             console.error('Detalhes do erro API:', error.response.data);
        }
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
          sale_date: saleDateRaw ? String(saleDateRaw).split('T')[0] : '',
          first_payment_date: parseDate(s.first_installment_date)
        }
      } catch (e) {
        console.error('Venda não encontrada', e)
        return null
      }
    }
  }
})