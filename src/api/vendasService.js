import axios from 'axios'
import { salesData } from './mocks/vendasData'

export default {
  async getSalesData() {
    // versão mockada
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: salesData }) 
        }, 1000)
      })
    // versão real
    // return axios.get('/vendas')
  }
}