const argon2 = require('./apps/api/node_modules/argon2');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    const hash = await argon2.hash('Admin@123', {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });
    const targetPath = path.join(process.cwd(), 'full_hash.txt');
    fs.writeFileSync(targetPath, hash);
    console.log('Hash written to:', targetPath);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
