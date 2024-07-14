import type { UseCase } from '@/core/use-case'
import type { SchemaValidator } from '@/infra/adapters/validation/schemas/ports'
import type { HttpRequest, HttpResponse } from '@/infra/adapters/http/ports'
import { InexistentRegisteredUserWithGivenEmailError } from '@/application/usecases/app/get-user-by-email/errors'
import { ok, notFound } from '@/presentation/helpers/http-helpers'

export class GetUserByEmailController {
  constructor(
    private readonly getUserByEmailUseCase: UseCase,
    private readonly getUserByEmailSchemaValidator: SchemaValidator,
  ) {
    Object.freeze(this)
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const request = this.getUserByEmailSchemaValidator.validate(req)
      const response = await this.getUserByEmailUseCase.execute(request)
      return ok(response)
    } catch (error) {
      if (error instanceof InexistentRegisteredUserWithGivenEmailError) {
        return notFound(error)
      }

      throw error
    }
  }
}
