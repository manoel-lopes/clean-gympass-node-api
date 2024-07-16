import type { HttpServer } from '@/infra/adapters/http/http-server/ports'
import {
  setCreateUserRoute,
  setAuthenticateUserRoute,
  setGetUserByEmailRoute,
  setGetUserByIdRoute,
} from '../routes/users'

export function setRoutes(app: HttpServer) {
  setCreateUserRoute(app)
  setAuthenticateUserRoute(app)
  setGetUserByEmailRoute(app)
  setGetUserByIdRoute(app)
}
