import type { HttpServer } from '@/infra/adapters/http/http-server/ports'
import { CreateUserController } from '@/presentation/controllers/create-user/create-user-controller'
import { CreateUserUseCase } from '@/application/usecases/create-user/create-user-use-case'
import { CreateUserZodSchemaValidator } from '@/infra/adapters/validation/schemas/create-user-zod-schema-validator'
import { PrismaUserRepository } from '@/infra/repositories/prisma/prisma-user-repository'
import { BcryptPasswordEncryptor } from '@/infra/adapters/password-encryptor/bcrypt/bcrypt-password-encryptor'

function makeCreateUserController(): {
  createUserController: CreateUserController
} {
  const prismaUserRepository = new PrismaUserRepository()
  const passwordEncryptor = new BcryptPasswordEncryptor()
  const createUserUseCase = new CreateUserUseCase(
    prismaUserRepository,
    passwordEncryptor,
  )
  const createUserSchemaValidator = new CreateUserZodSchemaValidator()
  const createUserController = new CreateUserController(
    createUserUseCase,
    createUserSchemaValidator,
  )
  return {
    createUserController,
  }
}

export function setCreateUserRoute(app: HttpServer) {
  app.route('POST', '/users', async (req, res) => {
    const { createUserController } = makeCreateUserController()
    const { statusCode, body } = await createUserController.handle(req)
    if (body) return res.status(statusCode).json(body)
    return res.status(statusCode).json()
  })
}
