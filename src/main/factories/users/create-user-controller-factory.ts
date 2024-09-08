import { PrismaUsersRepository } from '@/infra/repositories/prisma/prisma-users-repository'
import { BcryptProvider } from '@/infra/providers/cryptography/password-hashing/bcrypt/bcrypt.provider'
import { CreateUserUseCase } from '@/application/usecases/users'
import { CreateUserZodSchemaValidator } from '@/infra/adapters/validation/schemas/zod/users'
import { CreateUserController } from '@/presentation/controllers/users'

export function makeCreateUserController(): CreateUserController {
  const prismaUsersRepository = new PrismaUsersRepository()
  const passwordProvider = new BcryptProvider()
  const createUserUseCase = new CreateUserUseCase(
    prismaUsersRepository,
    passwordProvider,
  )
  const createUserSchemaValidator = new CreateUserZodSchemaValidator()
  const createUserController = new CreateUserController(
    createUserUseCase,
    createUserSchemaValidator,
  )
  return createUserController
}
