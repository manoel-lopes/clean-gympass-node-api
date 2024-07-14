import { PrismaUserRepository } from '@/infra/repositories/prisma/prisma-user-repository'
import { BcryptPasswordEncryptor } from '@/infra/adapters/password-encryptor/bcrypt/bcrypt-password-encryptor'
import { AuthenticateUserUseCase } from '@/application/usecases/auth/authenticate-user/authenticate-user-use-case'
import { AuthenticateUserZodSchemaValidator } from '@/infra/adapters/validation/schemas/zod/authenticate-user-zod-schema-validator'
import { AuthenticateUserController } from '@/presentation/controllers/authenticate-user/authenticate-user-controller'

export function makeAuthenticateUserController(): AuthenticateUserController {
  const userRepository = new PrismaUserRepository()
  const passwordEncryptor = new BcryptPasswordEncryptor()
  const authenticateUserUseCase = new AuthenticateUserUseCase(
    userRepository,
    passwordEncryptor,
  )
  const authenticateUserZodSchemaValidator =
    new AuthenticateUserZodSchemaValidator()
  const authenticateUserController = new AuthenticateUserController(
    authenticateUserUseCase,
    authenticateUserZodSchemaValidator,
  )
  return authenticateUserController
}
