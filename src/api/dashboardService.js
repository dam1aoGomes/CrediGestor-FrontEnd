import axios from 'axios'
import { dashboardData } from './mocks/dashboardData'

export default {
  async getDashboardData() {
    // versão mockada
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: dashboardData }) 
        }, 1000)
      })
    // versão real
    // return axios.get('/dashboard/summary')
  }
}