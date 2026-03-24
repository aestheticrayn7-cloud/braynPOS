import { signAccessToken } from '../src/lib/jwt'

async function test() {
  const payload = {
    sub: '0f736616-8360-498c-8438-fb15b6999245',
    email: 'chris@brayn.app',
    username: 'chris',
    role: 'MANAGER' as any,
    channelId: '319119eb-5e19-4ae0-9277-fdd6b42bde1a'
  }

  const token = signAccessToken(payload)
  console.log(`TOKEN:${token}`)
}

test()
