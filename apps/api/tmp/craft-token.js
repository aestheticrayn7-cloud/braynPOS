const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const SECRET = 'supersecret_brayn_jwt_key_2026'

async function test() {
  const payload = {
    sub: '0f736616-8360-498c-8438-fb15b6999245', // Chris ID from previous session
    username: 'chris',
    role: 'MANAGER',
    channelId: '319119eb-5e19-4ae0-9277-fdd6b42bde1a' // HQ ID
  }

  const token = jwt.sign(payload, SECRET, { expiresIn: '1h' })
  console.log(`TOKEN:${token}`)
}

test()
