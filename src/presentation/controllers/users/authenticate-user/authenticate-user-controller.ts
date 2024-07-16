import type { UseCase } from '@/core/use-case'
import type { SchemaValidator } from '@/infra/adapters/validation/schemas/ports'
import type { HttpRequest, HttpResponse } from '@/infra/adapters/http/ports'
import { InexistentRegisteredUser } from '@/application/errors'
import { InvalidPasswordError } from '@/application/usecases/users/authenticate-user/errors'
import { ok, notFound, badRequest } from '@/presentation/helpers/http-helpers'

export class AuthenticateUserController {
  constructor(
    private readonly authenticateUserUseCase: UseCase,
    private readonly authenticateUserSchemaValidator: SchemaValidator,
  ) {
    Object.freeze(this)
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const request = this.authenticateUserSchemaValidator.validate(req)
      const response = await this.authenticateUserUseCase.execute(request)
      return ok(response)
    } catch (error) {
      if (error instanceof InexistentRegisteredUser) {
        return notFound(error)
      }

      if (error instanceof InvalidPasswordError) {
        return badRequest(error)
      }
      throw error
    }
  }
}
