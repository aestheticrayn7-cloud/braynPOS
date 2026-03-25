import { EventEmitter } from 'events'

class RedisMock extends EventEmitter {
  constructor() { super() }
  async quit() { return 'OK' }
  async ping() { return 'PONG' }
  async get() { return null }
  async set() { return 'OK' }
  async del() { return 1 }
  async exists() { return 0 }
  async incr() { return 1 }
  async expire() { return 1 }
  status = 'ready'
}

export const redis = new RedisMock() as any
export const createBullConnection = () => new RedisMock() as any
export default redis
