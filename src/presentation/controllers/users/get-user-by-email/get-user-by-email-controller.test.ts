import type { UseCase } from '@/core/use-case'
import type { GetUserByEmailResponse } from '@/application/usecases/users/get-user-by-email/ports'
import { InexistentRegisteredUser } from '@/application/errors'
import type { SchemaValidator } from '@/infra/adapters/validation/schemas/ports'
import { SchemaValidatorStub } from '@/infra/adapters/validation/schemas/stub/schema-validator-stub'
import { SchemaParseFailedError } from '@/infra/adapters/validation/errors'
import { notFound, ok } from '@/presentation/helpers/http-helpers'
import { GetUserByEmailController } from './get-user-by-email-controller'

function makeGetUserByEmailSub(): UseCase {
  class GetUserByEmailStub implements UseCase {
    async execute(): Promise<GetUserByEmailResponse> {
      return Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        createdAt: new Date().toString(),
      })
    }
  }
  return new GetUserByEmailStub()
}

describe('GetUserByEmailController', () => {
  let getUserByEmailUseCase: UseCase
  let getUserByEmailSchemaValidator: SchemaValidator
  let sut: GetUserByEmailController
  const httpRequest = { params: { email: 'any_email' } }

  beforeEach(() => {
    getUserByEmailUseCase = makeGetUserByEmailSub()
    getUserByEmailSchemaValidator = new SchemaValidatorStub()
    sut = new GetUserByEmailController(
      getUserByEmailUseCase,
      getUserByEmailSchemaValidator,
    )
  })

  it('should return 404 if there is not a user with the given email', async () => {
    vi.spyOn(getUserByEmailUseCase, 'execute').mockRejectedValue(
      new InexistentRegisteredUser('email'),
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse).toEqual(
      notFound(new InexistentRegisteredUser('email')),
    )
  })

  it('should throw a schema validation error', async () => {
    vi.spyOn(getUserByEmailSchemaValidator, 'validate').mockImplementation(
      () => {
        throw new SchemaParseFailedError('any_error')
      },
    )

    expect(sut.handle(httpRequest)).rejects.toThrow(
      new SchemaParseFailedError('any_error'),
    )
  })

  it('should throw the error if is not a known error', async () => {
    vi.spyOn(getUserByEmailUseCase, 'execute').mockRejectedValue(
      new Error('any_error'),
    )

    expect(sut.handle(httpRequest)).rejects.toThrow(new Error('any_error'))
  })

  it('should return 200 and the user data on success', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(
      ok({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        createdAt: new Date().toString(),
      }),
    )
  })
})
