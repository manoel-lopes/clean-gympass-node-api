import Fastify from 'fastify'
import cors from '@fastify/cors'
import type { FastifyInstance, FastifyReply } from 'fastify'
import type { HttpServer } from '@/infra/adapters/http/http-server/ports'
import type { RouteHandler } from '@/infra/api/ports'
import type {
  ApiRequest,
  ApiResponse,
  HttpMethod,
  HttpStatusCode,
} from '@/infra/adapters/http/ports'
import { env } from '@/lib/env'

type ErrorHandler = (error: Error, req: ApiRequest, res: ApiResponse) => void

export class FastifyAdapter implements HttpServer {
  private readonly app: FastifyInstance

  constructor() {
    this.app = Fastify(
      env.NODE_ENV === 'development' ? { logger: true } : { logger: false },
    )
    this.app.register(cors)
    Object.freeze(this)
  }

  route(method: HttpMethod, url: string, handler: RouteHandler): void {
    this.app.route({
      method,
      url,
      handler: async (req, reply) => {
        const res = this.adaptReply(reply)
        try {
          await handler(req, res)
        } catch (error) {
          this.app.log.error(error)
          reply.send(error)
        }
      },
    })
  }

  async listen(port: number): Promise<void> {
    await this.handlePromise(this.app.listen({ host: '0.0.0.0', port }))
  }

  async close() {
    await this.handlePromise(this.app.close())
  }

  setErrorHandler(errorHandler: ErrorHandler) {
    this.app.setErrorHandler((error, req, reply) => {
      const res = this.adaptReply(reply)
      errorHandler(error, req, res)
    })
  }

  private async handlePromise(promise: Promise<unknown>): Promise<void> {
    try {
      await promise
    } catch (err) {
      this.app.log.error(err)
      process.exit(1)
    }
  }

  private adaptReply(reply: FastifyReply): ApiResponse {
    const res = {
      status(statusCode: HttpStatusCode) {
        return {
          json(body: unknown) {
            return reply.code(statusCode).send(body)
          },
        }
      },
    }
    return res
  }
}
