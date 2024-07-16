import { PrismaUserRepository } from '@/infra/repositories/prisma/prisma-user-repository'
import { GetUserByIdUseCase } from '@/application/usecases/users'
import { GetUserByIdZodSchemaValidator } from '@/infra/adapters/validation/schemas/zod/users'
import { GetUserByIdController } from '@/presentation/controllers/users'

export function makeGetUserByIdController(): GetUserByIdController {
  const userRepository = new PrismaUserRepository()
  const getUserById = new GetUserByIdUseCase(userRepository)
  const getUserByIdSchemaValidator = new GetUserByIdZodSchemaValidator()
  const getUserByIdController = new GetUserByIdController(
    getUserById,
    getUserByIdSchemaValidator,
  )
  return getUserByIdController
}
