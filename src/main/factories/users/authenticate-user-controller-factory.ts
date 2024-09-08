import { PrismaUsersRepository } from '@/infra/repositories/prisma/prisma-users-repository'
import { BcryptProvider } from '@/infra/providers/cryptography/password-hashing/bcrypt/bcrypt.provider'
import { AuthenticateUserUseCase } from '@/application/usecases/users'
import { AuthenticateUserZodSchemaValidator } from '@/infra/adapters/validation/schemas/zod/users'
import { AuthenticateUserController } from '@/presentation/controllers/users'

export function makeAuthenticateUserController(): AuthenticateUserController {
  const usersRepository = new PrismaUsersRepository()
  const passwordProvider = new BcryptProvider()
  const authenticateUserUseCase = new AuthenticateUserUseCase(
    usersRepository,
    passwordProvider,
  )
  const authenticateUserZodSchemaValidator =
    new AuthenticateUserZodSchemaValidator()
  const authenticateUserController = new AuthenticateUserController(
    authenticateUserUseCase,
    authenticateUserZodSchemaValidator,
  )
  return authenticateUserController
}
