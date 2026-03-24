import { PrismaClient } from '@prisma/client';
import * as OTPAuth from 'otpauth';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@brayn.app' } });
  if (!user) { console.log('USER NOT FOUND'); return; }
  
  console.log('mfaEnabled:', user.mfaEnabled);
  
  if (!user.mfaSecret) {
    console.log('No MFA secret set — disabling MFA flag...');
    await prisma.user.update({
      where: { email: 'admin@brayn.app' },
      data: { mfaEnabled: false, mfaSecret: null }
    });
    console.log('MFA disabled. Login will now work without a TOTP code.');
    return;
  }
  
  // Generate current TOTP code
  const totp = new OTPAuth.TOTP({ secret: OTPAuth.Secret.fromBase32(user.mfaSecret), digits: 6, period: 30 });
  console.log('Current TOTP code:', totp.generate());
}

main().finally(() => prisma.$disconnect());
