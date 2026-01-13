import api from './api.js'

export default {
  getAll() {
    return api.get('/api/customers') 
  }
}