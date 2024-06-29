import type { HttpServer } from '@/infra/adapters/http/http-server/ports'
import { setCreateUserRoute } from '../routes/create-user/create-user-route'

export function setRoutes(app: HttpServer) {
  setCreateUserRoute(app)
  // app.route('GET', '/', async (_, res) => {
  //   res.status(200).json('Hello World!')
  // })
}
