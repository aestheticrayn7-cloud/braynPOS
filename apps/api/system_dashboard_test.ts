import axios from 'axios'

const API_URL = 'http://localhost:8080/v1'

async function test(email: string, pass: string) {
  try {
    console.log(`--- TESTING DASHBOARD FOR ${email} ---`)
    const loginRes = await axios.post(`${API_URL}/auth/login`, { email, password: pass })
    const token = loginRes.data.accessToken
    
    // 1. Dashboard Summary
    const summaryRes = await axios.get(`${API_URL}/dashboard/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log('SUMMARY:', JSON.stringify(summaryRes.data, null, 2))

    // 2. Admin Dashboard Report (if admin)
    const today = new Date().toISOString().split('T')[0]
    try {
        const adminRes = await axios.get(`${API_URL}/reports/admin-dashboard?startDate=${today}T00:00:00Z&endDate=${today}T23:59:59Z`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log('ADMIN REPORT:', JSON.stringify(adminRes.data, null, 2))
    } catch (e) {
        console.log('Admin report not available for this role')
    }
    
    console.log('----------------------------------------\n')
  } catch (err: any) {
    console.error(`ERROR FOR ${email}:`, err.response?.data || err.message)
  }
}

async function main() {
  await test('admin@brayn.app', 'Admin@123')
  // Add other users if we find them
}

main()
