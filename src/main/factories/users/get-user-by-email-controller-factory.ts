import { PrismaUsersRepository } from '@/infra/repositories/prisma/prisma-users-repository'
import { GetUserByEmailUseCase } from '@/application/usecases/users'
import { GetUserByEmailZodSchemaValidator } from '@/infra/adapters/validation/schemas/zod/users'
import { GetUserByEmailController } from '@/presentation/controllers/users'

export function makeGetUserByEmailController(): GetUserByEmailController {
  const usersRepository = new PrismaUsersRepository()
  const getUserByEmail = new GetUserByEmailUseCase(usersRepository)
  const getUserByEmailSchemaValidator = new GetUserByEmailZodSchemaValidator()
  const getUserByEmailController = new GetUserByEmailController(
    getUserByEmail,
    getUserByEmailSchemaValidator,
  )
  return getUserByEmailController
}
