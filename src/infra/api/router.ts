import type { HttpServer } from '@/infra/adapters/http/http-server/ports'
import type { HttpMethod } from '@/infra/adapters/http/ports'
import type { RouteHandler } from './ports'

export class Router {
  constructor(private readonly httpServer: HttpServer) {
    Object.freeze(this)
  }

  route(method: HttpMethod, uri: string, handler: RouteHandler): void {
    this.httpServer.route(method, uri, handler)
  }
}
