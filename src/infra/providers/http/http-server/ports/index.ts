import type { HttpMethod } from '@/infra/adapters/http/ports'
import type { RouteHandler } from '@/infra/api/ports'

export type HttpServer = {
  route(method: HttpMethod, url: string, handler: RouteHandler): void
  listen: (port: number) => Promise<void>
}
