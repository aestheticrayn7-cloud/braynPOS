import { api } from '../apps/web/src/lib/api-client'

async function stress() {
  const API_URL = 'http://localhost:8080/v1'
  const credentials = { email: 'admin@brayn.app', password: 'Admin@123' }

  console.log('--- Starting Performance Baseline Audit ---')

  // 1. Auth Stress (Argon2)
  console.log('\n[1/3] Measuring Auth Performance (Argon2)...')
  const authStart = Date.now()
  const logins = 5
  for (let i = 0; i < logins; i++) {
    const s = Date.now()
    await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    console.log(`  Login ${i+1}: ${Date.now() - s}ms`)
  }
  const authAvg = (Date.now() - authStart) / logins
  console.log(`Average Login Latency: ${authAvg.toFixed(2)}ms`)

  // Get token for further tests
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  const { accessToken } = await loginRes.json()

  // 2. Health Check (Diagnostics overhead)
  console.log('\n[2/3] Measuring Diagnostics Performance...')
  const healthStart = Date.now()
  const healthChecks = 10
  for (let i = 0; i < healthChecks; i++) {
    const s = Date.now()
    await fetch(`${API_URL}/dashboard/health`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
    // console.log(`  Health ${i+1}: ${Date.now() - s}ms`)
  }
  const healthAvg = (Date.now() - healthStart) / healthChecks
  console.log(`Average Health Check Latency: ${healthAvg.toFixed(2)}ms`)

  // 3. Audit Log Retrieval
  console.log('\n[3/3] Measuring Audit Log Retrieval...')
  const auditStart = Date.now()
  const auditChecks = 5
  for (let i = 0; i < auditChecks; i++) {
    const s = Date.now()
    await fetch(`${API_URL}/audit`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
    // console.log(`  Audit ${i+1}: ${Date.now() - s}ms`)
  }
  const auditAvg = (Date.now() - auditStart) / auditChecks
  console.log(`Average Audit Log Latency: ${auditAvg.toFixed(2)}ms`)

  console.log('\n--- Performance Audit Complete ---')
}

stress().catch(console.error)
