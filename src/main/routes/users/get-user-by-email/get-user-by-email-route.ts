import type { HttpServer } from '@/infra/adapters/http/http-server/ports'
import { makeGetUserByEmailController } from '@/main/factories/users/get-user-by-email-controller-factory'

export function setGetUserByEmailRoute(app: HttpServer) {
  app.route('GET', '/user/:email', async (req, res) => {
    const getUserByEmailController = makeGetUserByEmailController()
    const { statusCode, body } = await getUserByEmailController.handle(req)
    return res.status(statusCode).json(body)
  })
}
