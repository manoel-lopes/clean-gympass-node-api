import type { HttpServer } from '@/infra/adapters/http/http-server/ports'
import { setCreateUserRoute } from '../routes/create-user/create-user-route'
import { setGetUserByEmailRoute } from '../routes/get-user-by-email/get-user-by-email-route'
import { setAuthenticateUserRoute } from '../routes/authenticate-user/authenticate-user-route'

export function setRoutes(app: HttpServer) {
  setCreateUserRoute(app)
  setGetUserByEmailRoute(app)
  setAuthenticateUserRoute(app)
}
