import axios from 'axios'
import { mockDashboardData } from './mocks/dashboardData'

export default {
  async getDashboardData() {
    // versão mockada
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: mockDashboardData }) 
        }, 1000)
      })
    // versão real
    // return axios.get('/dashboard/summary')
  }
}