import type { GetUserByEmail } from '@/domain/usecases/get-user-by-email'
import type { GetUserByEmailSchemaValidator } from '@/application/validation/schema/get-user-by-email-schema-validator'
import type { HttpRequest, HttpResponse } from '@/infra/adapters/http/ports'
import { InexistentRegisteredUserWithGivenEmailError } from '@/application/usecases/app/get-user-by-email/errors'
import { ok, notFound } from '@/presentation/helpers/http-helpers'

export class GetUserByEmailController {
  constructor(
    private readonly getUserByEmailUseCase: GetUserByEmail,
    private readonly getUserByEmailSchemaValidator: GetUserByEmailSchemaValidator,
  ) {
    Object.freeze(this)
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const request = this.getUserByEmailSchemaValidator.validate(req)
      const response = await this.getUserByEmailUseCase.execute(request.email)
      return ok(response)
    } catch (error) {
      if (error instanceof InexistentRegisteredUserWithGivenEmailError) {
        return notFound(error)
      }

      throw error
    }
  }
}
