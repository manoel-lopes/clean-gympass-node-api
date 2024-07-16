import { PrismaUserRepository } from '@/infra/repositories/prisma/prisma-user-repository'
import { GetUserByEmailUseCase } from '@/application/usecases/users'
import { GetUserByEmailZodSchemaValidator } from '@/infra/adapters/validation/schemas/zod/users'
import { GetUserByEmailController } from '@/presentation/controllers/users'

export function makeGetUserByEmailController(): GetUserByEmailController {
  const userRepository = new PrismaUserRepository()
  const getUserByEmail = new GetUserByEmailUseCase(userRepository)
  const getUserByEmailSchemaValidator = new GetUserByEmailZodSchemaValidator()
  const getUserByEmailController = new GetUserByEmailController(
    getUserByEmail,
    getUserByEmailSchemaValidator,
  )
  return getUserByEmailController
}
