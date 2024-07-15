import type { UseCase } from '@/core/use-case'
import type { SchemaValidator } from '@/infra/adapters/validation/schemas/ports'
import type { HttpRequest, HttpResponse } from '@/infra/adapters/http/ports'
import { InexistentRegisteredUser } from '@/application/errors'
import { ok, notFound } from '@/presentation/helpers/http-helpers'

export class GetUserByIdController {
  constructor(
    private readonly getUserByIdUseCase: UseCase,
    private readonly getUserByIdSchemaValidator: SchemaValidator,
  ) {
    Object.freeze(this)
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const request = this.getUserByIdSchemaValidator.validate(req)
      const response = await this.getUserByIdUseCase.execute(request)
      return ok(response)
    } catch (error) {
      if (error instanceof InexistentRegisteredUser) {
        return notFound(error)
      }

      throw error
    }
  }
}
