import type { UseCase } from '@/core/use-case'
import type { SchemaValidator } from '@/infra/adapters/validation/schemas/ports'
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
    private readonly createUserUseCase: UseCase,
    private readonly createUserSchemaValidator: SchemaValidator,
  ) {
    Object.freeze(this)
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const request = this.createUserSchemaValidator.validate(req)
      await this.createUserUseCase.execute(request)
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
