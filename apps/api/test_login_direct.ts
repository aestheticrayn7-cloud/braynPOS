import { authService } from './src/modules/auth/auth.service.js'

async function check() {
  console.log('--- DIRECT LOGIN TEST ---')
  const email = 'admin@brayn.app'
  const password = 'Admin@123'

  try {
    const result = await authService.login({ email, password })
    console.log('Login Result:', JSON.stringify(result, null, 2))
  } catch (err) {
    console.error('Login Error:', err)
  }
}

check().catch(console.error)
