import axios from 'axios'

async function simulate() {
  const API = 'http://localhost:8080/api/v1'
  
  try {
    console.log('Logging in as Evans...')
    const login = await axios.post(`${API}/auth/login`, {
      email: 'manager3@brayn.app',
      password: 'Admin@123'
    })
    
    const token = login.data.accessToken
    console.log('Token acquired.')
    
    console.log('Fetching dashboard summary...')
    const res = await axios.get(`${API}/dashboard/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    console.log('Dashboard Data:', JSON.stringify(res.data, null, 2))
  } catch (err: any) {
    console.error('Simulation failed:', err.response?.data || err.message)
  }
}

simulate()
