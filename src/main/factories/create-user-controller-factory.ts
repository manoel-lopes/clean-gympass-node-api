import { PrismaUserRepository } from '@/infra/repositories/prisma/prisma-user-repository'
import { BcryptPasswordEncryptor } from '@/infra/adapters/password-encryptor/bcrypt/bcrypt-password-encryptor'
import { CreateUserUseCase } from '@/application/usecases/app/create-user/create-user-use-case'
import { CreateUserZodSchemaValidator } from '@/infra/adapters/validation/schemas/zod/create-user-zod-schema-validator'
import { CreateUserController } from '@/presentation/controllers/create-user/create-user-controller'

export function makeCreateUserController(): CreateUserController {
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
  return createUserController
}
