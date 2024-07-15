import { PrismaClient } from '@prisma/client'
import { type Env, env } from '@/lib/env'

type LogLevel = 'query' | 'warn' | 'error'
const log: Record<Env['NODE_ENV'], LogLevel[]> = {
  development: ['query'],
  production: ['error', 'warn'],
  test: [],
}

export const prisma = new PrismaClient({
  log: log[env.NODE_ENV || 'development'],
})
