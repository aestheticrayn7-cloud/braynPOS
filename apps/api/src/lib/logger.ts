import pino from 'pino'
import { requestContext } from './request-context.plugin.js'

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),

  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' } }
    : undefined,

  mixin() {
    const ctx = requestContext.getStore()
    if (!ctx) return {}
    return {
      requestId: ctx.requestId,
      ...(ctx.userId    && { userId:    ctx.userId }),
      ...(ctx.role      && { role:      ctx.role }),
      ...(ctx.channelId && { channelId: ctx.channelId }),
    }
  },

  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },

  redact: {
    paths: [
      'req.headers.authorization',
      'res.headers["set-cookie"]',
      'password',
      'passwordHash',
      'token',
      'accessToken',
      'refreshToken',
      'mfaSecret',
      'recoveryCode',
      '*.password',
      '*.token',
      '*.refreshToken'
    ],
    remove: true
  },

  base: {
    service: 'brayn-api',
    env:     process.env.NODE_ENV ?? 'development',
  },
})

export const salesLogger      = logger.child({ module: 'sales' })
export const commissionLogger = logger.child({ module: 'commission' })
export const authLogger       = logger.child({ module: 'auth' })
export const creditLogger     = logger.child({ module: 'credit' })
export const payrollLogger    = logger.child({ module: 'payroll' })
export const stockLogger      = logger.child({ module: 'stock' })
