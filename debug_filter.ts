const API_URL = 'http://localhost:8080/v1'
const token = '...' // I need a token, but I can check the logs instead

async function testFilter() {
  const start = new Date()
  start.setHours(0,0,0,0)
  const end = new Date()
  end.setHours(23,59,59,999)

  const url = `${API_URL}/purchases?startDate=${start.toISOString()}&endDate=${end.toISOString()}`
  console.log('Testing URL:', url)
  
  // Actually, I'll just check if start.toISOString() contains chars that need encoding
  console.log('ISO String:', start.toISOString())
}

testFilter()
