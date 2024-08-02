import { PrismaUsersRepository } from '@/infra/repositories/prisma/prisma-users-repository'
import { GetUserByIdUseCase } from '@/application/usecases/users'
import { GetUserByIdZodSchemaValidator } from '@/infra/adapters/validation/schemas/zod/users'
import { GetUserByIdController } from '@/presentation/controllers/users'

export function makeGetUserByIdController(): GetUserByIdController {
  const usersRepository = new PrismaUsersRepository()
  const getUserById = new GetUserByIdUseCase(usersRepository)
  const getUserByIdSchemaValidator = new GetUserByIdZodSchemaValidator()
  const getUserByIdController = new GetUserByIdController(
    getUserById,
    getUserByIdSchemaValidator,
  )
  return getUserByIdController
}
