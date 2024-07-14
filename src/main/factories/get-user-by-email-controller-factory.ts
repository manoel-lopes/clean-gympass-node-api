import { GetUserByEmailUseCase } from '@/application/usecases/app/get-user-by-email/get-user-by-email-use-case'
import { GetUserByEmailZodSchemaValidator } from '@/infra/adapters/validation/schemas/zod/get-user-by-email-zod-schema-validator'
import { PrismaUserRepository } from '@/infra/repositories/prisma/prisma-user-repository'
import { GetUserByEmailController } from '@/presentation/controllers/get-user-by-email/get-user-by-email-controller'

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
