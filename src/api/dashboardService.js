import axios from 'axios'

// Configure o endereço do seu Backend Python aqui
// Se você já tiver um arquivo 'src/api/axios.js' configurado, importe ele em vez do axios puro
const api = axios.create({
  baseURL: 'http://localhost:8000/api' // <--- VERIFIQUE A PORTA DO SEU PYTHON
})

export default {
  async getDashboardData() {
    // Agora fazemos a chamada real
    // Supondo que sua rota no Python retorne tanto stats quanto activities juntos
    return api.get('/dashboard') 
  }
}

// import axios from 'axios'
// import { dashboardData } from './mocks/dashboardData'

// export default {
//   async getDashboardData() {
//     // versão mockada
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           resolve({ data: dashboardData }) 
//         }, 1000)
//       })
//     // versão real
//     // return axios.get('/dashboard/summary')
//   }
// }