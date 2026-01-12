import { api } from "./api";

export default {
  async getDashboardData() {
    return await api.get('/api/dashboard') 
  }
}