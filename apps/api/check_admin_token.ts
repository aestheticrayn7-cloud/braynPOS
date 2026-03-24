import axios from 'axios'
import jwt from 'jsonwebtoken'

const API_URL = 'http://localhost:8080/v1'

async function main() {
  try {
    const loginRes = await axios.post(`${API_URL}/auth/login`, { 
      email: 'admin@brayn.app', 
      password: 'Admin@123' 
    })
    const token = loginRes.data.accessToken
    const decoded = jwt.decode(token)
    console.log('DECODED TOKEN:', JSON.stringify(decoded, null, 2))
    console.log('USER OBJECT:', JSON.stringify(loginRes.data.user, null, 2))
  } catch (err: any) {
    console.error('ERROR:', err.response?.data || err.message)
  }
}

main()
