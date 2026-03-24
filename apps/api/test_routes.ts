import { buildApp } from './src/app.js';
async function test() {
  const app = await buildApp();
  await app.ready();
  const routes = app.printRoutes();
  console.log(routes.split('\n').filter(r => r.includes('login') || r.includes('auth')).join('\n'));
}
test();
