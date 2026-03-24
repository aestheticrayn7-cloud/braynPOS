import argon2 from 'argon2'

async function gen() {
  const hash = await argon2.hash('admin123')
  console.log(hash)
}

gen()
