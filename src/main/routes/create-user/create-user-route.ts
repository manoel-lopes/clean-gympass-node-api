import type { HttpServer } from '@/infra/adapters/http/http-server/ports'
import { makeCreateUserController } from '@/main/factories/create-user-controller-factory'

export function setCreateUserRoute(app: HttpServer) {
  app.route('POST', '/user', async (req, res) => {
    const createUserController = makeCreateUserController()
    const { statusCode, body } = await createUserController.handle(req)
    return res.status(statusCode).json(body)
  })
}
