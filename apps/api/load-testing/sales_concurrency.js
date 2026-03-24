import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 5 },  // ramp up to 5 concurrent users
    { duration: '1m', target: 5 },   // stay at 5 users
    { duration: '30s', target: 0 },  // ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // Sales involve triggers/ACID, allow up to 2s
    http_req_failed: ['rate<0.05'],    // allow up to 5% failures due to possible lock contention
  },
};

const BASE_URL = 'http://localhost:4000/v1';

// Stable IDs from seed
const ITEM_ID = 'c0a80101-0000-4000-8000-000000000002';
const CHANNEL_ID = '31f03cd3-89bd-4916-a367-27e163b2f283'; // HQ Channel ID
const SESSION_ID = 'c0a80101-0000-4000-8000-000000000004';

export default function () {
  // 1. Auth first to get token
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: 'admin@brayn.app',
    password: 'Admin@123',
  }), { headers: { 'Content-Type': 'application/json' } });

  const token = loginRes.json().accessToken;
  if (!token) return;

  // 2. Commit a sale
  const salePayload = JSON.stringify({
    channelId: CHANNEL_ID,
    sessionId: SESSION_ID,
    saleType: 'RETAIL',
    items: [
      {
        itemId: ITEM_ID,
        quantity: 1,
        unitPrice: 45000,
      }
    ],
    payments: [
      {
        method: 'CASH',
        amount: 45000,
      }
    ]
  });

  const res = http.post(`${BASE_URL}/sales`, salePayload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  check(res, {
    'sale created (201)': (r) => r.status === 201,
    'has receipt number': (r) => r.json().receiptNo !== undefined,
  });

  sleep(2); // Wait between sales
}
