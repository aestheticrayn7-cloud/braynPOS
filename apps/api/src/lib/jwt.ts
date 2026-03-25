import jwt  from 'jsonwebtoken'
import fs   from 'fs'
import path from 'path'
import { authLogger } from './logger.js'
import type { UserRole } from '@prisma/client'

const PRIVATE_KEY_PATH = process.env.JWT_PRIVATE_KEY_PATH || './keys/private.pem'
const PUBLIC_KEY_PATH  = process.env.JWT_PUBLIC_KEY_PATH  || './keys/public.pem'
const ACCESS_EXPIRY    = process.env.JWT_ACCESS_EXPIRY    || '15m'
const REFRESH_EXPIRY   = process.env.JWT_REFRESH_EXPIRY   || '7d'

// Shared TTL constant — used both here and in auth.service.ts
// so the two values can never drift independently.
export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

let privateKey: string
let publicKey:  string

// ── Key Loading Logic ────────────────────────────────────────────────
const envPrivateKey = process.env.JWT_PRIVATE_KEY
const envPublicKey  = process.env.JWT_PUBLIC_KEY

if (envPrivateKey && envPublicKey) {
  privateKey = envPrivateKey.replace(/\\n/g, '\n')
  publicKey  = envPublicKey.replace(/\\n/g, '\n')
} else {
  try {
    privateKey = fs.readFileSync(path.resolve(PRIVATE_KEY_PATH), 'utf8')
    publicKey  = fs.readFileSync(path.resolve(PUBLIC_KEY_PATH),  'utf8')
  } catch {
    authLogger.warn(
      { privatePath: PRIVATE_KEY_PATH, publicPath: PUBLIC_KEY_PATH },
      'RSA keys not found (env or file) — falling back to HMAC HS256 (development only)'
    )
    const secret = process.env.JWT_SECRET
    if (!secret && process.env.NODE_ENV !== 'test') {
      throw new Error('JWT_SECRET, RSA key files, or RSA key env vars must be provided')
    }
    privateKey = secret || 'test-secret-only'
    publicKey  = privateKey
  }
}

const isRSA     = privateKey.includes('-----BEGIN')
const algorithm = isRSA ? 'RS256' : 'HS256'

// ── FIX: Hard block HS256 in production ──────────────────────────────
// Without this guard, missing RSA key files in production silently fall
// back to a weak HMAC secret — or worse, the hardcoded dev string.
// RS256 with asymmetric keys is non-negotiable in production.
if (process.env.NODE_ENV === 'production' && !isRSA) {
  throw new Error(
    'FATAL: JWT is running in HS256 mode in a production environment. ' +
    'Set JWT_PRIVATE_KEY_PATH and JWT_PUBLIC_KEY_PATH to valid RSA PEM files. ' +
    'Server will not start until this is resolved.'
  )
}

// ── Token payload shape ───────────────────────────────────────────────
export interface TokenPayload {
  id:           string
  sub:          string
  username:     string
  email:        string
  role:         UserRole
  channelId:    string | null
  mfaVerified?: boolean
}

// ── Sign access token ─────────────────────────────────────────────────
export function signAccessToken(
  payload: Omit<TokenPayload, 'id'> & { id?: string }
): string {
  const userId = payload.sub || payload.id
  if (!userId) throw new Error('Token payload must have sub or id')

  const signPayload: TokenPayload = {
    ...payload,
    id:  userId,
    sub: userId,
  }

  return jwt.sign(signPayload, privateKey, {
    algorithm,
    expiresIn: ACCESS_EXPIRY,
    issuer:    'brayn-api',
  } as jwt.SignOptions)
}

// ── Sign refresh token ────────────────────────────────────────────────
export function signRefreshToken(userId: string): string {
  return jwt.sign(
    { sub: userId, type: 'refresh' },
    privateKey,
    { algorithm, expiresIn: REFRESH_EXPIRY, issuer: 'brayn-api' } as jwt.SignOptions
  )
}

// ── Verify access token ───────────────────────────────────────────────
export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, publicKey, {
    algorithms: [algorithm],
    issuer:     'brayn-api',
  }) as TokenPayload
}

// ── Verify refresh token ──────────────────────────────────────────────
export function verifyRefreshToken(token: string): { sub: string; type: string } {
  const payload = jwt.verify(token, publicKey, {
    algorithms: [algorithm],
    issuer:     'brayn-api',
  }) as any

  return {
    sub:  payload.sub || payload.id,
    type: payload.type,
  }
}
