async function testRoute() {
  try {
    const res = await fetch('http://localhost:8080/api/v1/sales/test-id/reverse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'test' })
    })
    console.log('Status:', res.status)
    const text = await res.text()
    console.log('Response:', text)
  } catch (e) {
    console.error('Fetch failed:', e.message)
  }
}
testRoute()
