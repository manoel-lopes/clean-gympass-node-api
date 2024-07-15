import type { HttpServer } from '@/infra/adapters/http/http-server/ports'
import { makeGetUserByIdController } from '@/main/factories/get-user-by-id-controller-factory'

export function setGetUserByIdRoute(app: HttpServer) {
  app.route('GET', '/user', async (req, res) => {
    const getUserByIdController = makeGetUserByIdController()
    const { statusCode, body } = await getUserByIdController.handle(req)
    return res.status(statusCode).json(body)
  })
}
