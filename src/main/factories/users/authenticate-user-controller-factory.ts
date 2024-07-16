import { PrismaUserRepository } from '@/infra/repositories/prisma/prisma-user-repository'
import { BcryptPasswordEncryptor } from '@/infra/adapters/password-encryptor/bcrypt/bcrypt-password-encryptor'
import { AuthenticateUserUseCase } from '@/application/usecases/users'
import { AuthenticateUserZodSchemaValidator } from '@/infra/adapters/validation/schemas/zod/users'
import { AuthenticateUserController } from '@/presentation/controllers/users'

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
