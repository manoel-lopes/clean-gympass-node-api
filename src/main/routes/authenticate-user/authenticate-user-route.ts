import type { HttpServer } from '@/infra/adapters/http/http-server/ports'
import { makeAuthenticateUserController } from '@/main/factories/authenticate-user-factory-validator'

export function setAuthenticateUserRoute(app: HttpServer) {
  app.route('POST', '/auth', async (req, res) => {
    const authenticateUserController = makeAuthenticateUserController()
    const { statusCode, body } = await authenticateUserController.handle(req)
    return res.status(statusCode).json(body)
  })
}
