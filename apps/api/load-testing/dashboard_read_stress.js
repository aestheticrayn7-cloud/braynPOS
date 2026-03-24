import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 }, // ramp up to 10 readers
    { duration: '1m', target: 20 },  // spike to 20 readers
    { duration: '30s', target: 0 },  // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // Readers should get data in < 1s
    http_req_failed: ['rate<0.01'],    // less than 1% failure rate
  },
};

const BASE_URL = 'http://localhost:4000/v1';

export default function () {
  // 1. Auth first
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: 'admin@brayn.app',
    password: 'Admin@123',
  }), { headers: { 'Content-Type': 'application/json' } });

  const token = loginRes.json().accessToken;
  if (!token) return;

  const today = new Date().toISOString().split('T')[0];

  // 2. Stress the summary (HQ view involves multiple counts/sums)
  const summaryRes = http.get(`${BASE_URL}/dashboard/summary`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  check(summaryRes, { 'summary status 200': (r) => r.status === 200 });

  // 3. Stress the admin report (raw SQL aggregation across all channels)
  const reportRes = http.get(`${BASE_URL}/reports/admin-dashboard?startDate=${today}T00:00:00Z&endDate=${today}T23:59:59Z`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  check(reportRes, { 'report status 200': (r) => r.status === 200 });

  sleep(1);
}
