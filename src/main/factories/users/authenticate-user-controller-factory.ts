import { PrismaUsersRepository } from '@/infra/repositories/prisma/prisma-users-repository'
import { BcryptPasswordEncryptor } from '@/infra/adapters/password-encryptor/bcrypt/bcrypt-password-encryptor'
import { AuthenticateUserUseCase } from '@/application/usecases/users'
import { AuthenticateUserZodSchemaValidator } from '@/infra/adapters/validation/schemas/zod/users'
import { AuthenticateUserController } from '@/presentation/controllers/users'

export function makeAuthenticateUserController(): AuthenticateUserController {
  const UsersRepository = new PrismaUsersRepository()
  const passwordEncryptor = new BcryptPasswordEncryptor()
  const authenticateUserUseCase = new AuthenticateUserUseCase(
    UsersRepository,
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
