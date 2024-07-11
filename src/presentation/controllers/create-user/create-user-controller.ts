import type { CreateUser } from '@/domain/usecases/create-user'
import type { CreateUserSchemaValidator } from '@/application/validation/schema/create-user-schema-validator'
import type { HttpRequest, HttpResponse } from '@/infra/adapters/http/ports'
import {
  created,
  conflict,
  badRequest,
} from '@/presentation/helpers/http-helpers'
import { EmailAlreadyBeingUsedError } from '@/application/usecases/app/create-user/errors'
import { HashingPasswordError } from '@/infra/adapters/password-encryptor/errors'

export class CreateUserController {
  constructor(
    private readonly createUserUseCase: CreateUser,
    private readonly createUserSchemaValidator: CreateUserSchemaValidator,
  ) {
    Object.freeze(this)
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const input = this.createUserSchemaValidator.validate(req)
      await this.createUserUseCase.execute(input)
      return created()
    } catch (error) {
      if (error instanceof EmailAlreadyBeingUsedError) {
        return conflict(error)
      }

      if (error instanceof HashingPasswordError) {
        return badRequest(error)
      }
      throw error
    }
  }
}
