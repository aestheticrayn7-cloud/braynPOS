
import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(['SUPER_ADMIN', 'MANAGER_ADMIN', 'MANAGER', 'CASHIER', 'STOREKEEPER', 'PROMOTER', 'SALES_PERSON']),
  channelId: z.string().uuid().nullable().optional(),
});

const data = {
  username: 'reo2',
  email: 'storekeeper2@brayn.app',
  password: 'password123',
  role: 'STOREKEEPER',
  channelId: null
};

try {
  console.log('Testing schema with null channelId...');
  registerSchema.parse(data);
  console.log('Success!');
} catch (err) {
  console.error('Failed:', JSON.stringify(err, null, 2));
}
