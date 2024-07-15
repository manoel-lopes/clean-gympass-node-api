import { GetUserByIdUseCase } from '@/application/usecases/app/get-user-by-id/get-user-by-id-use-case'
import { GetUserByIdZodSchemaValidator } from '@/infra/adapters/validation/schemas/zod/get-user-by-id-zod-schema-validator'
import { PrismaUserRepository } from '@/infra/repositories/prisma/prisma-user-repository'
import { GetUserByIdController } from '@/presentation/controllers/get-user-by-id/get-user-by-id-controller'

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
