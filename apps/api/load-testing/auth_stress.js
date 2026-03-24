import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // ramp up to 20 users
    { duration: '1m', target: 20 },  // stay at 20 users
    { duration: '30s', target: 0 },  // ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must be below 500ms
    http_req_failed: ['rate<0.01'],   // less than 1% failure rate
  },
};

const BASE_URL = 'http://localhost:4000/v1';

export default function () {
  const payload = JSON.stringify({
    email: 'admin@brayn.app',
    password: 'Admin@123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/auth/login`, payload, params);

  check(res, {
    'is status 200': (r) => r.status === 200,
    'has access token': (r) => r.json().accessToken !== undefined,
  });

  sleep(1);
}
