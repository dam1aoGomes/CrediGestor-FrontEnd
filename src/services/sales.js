import { api } from "./api";

export default {
  getSalesData() {
    return api.get('/api/sales')
  },

  getClients() {
    return api.get('/api/customers')
  },

  create(saleData) {
    return api.post('/api/sales', saleData)
  },

  update(id, saleData) {
    return api.put(`/api/sales/${id}`, saleData)
  },

  delete(id) {
    return api.delete(`/api/sales/${id}`)
  },
  
  getSaleById(id) {
    return api.get(`/api/sales/${id}`)
  }
}