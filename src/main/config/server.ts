import { env } from '@/lib/env'
import { app } from '@/main/config/app'

const server = { ...app, address: () => ({ port: env.PORT }) }

export { server }
