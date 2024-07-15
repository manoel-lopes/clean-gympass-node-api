import type { UseCase } from '@/core/use-case'
import type { SchemaValidator } from '@/infra/adapters/validation/schemas/ports'
import type { GetUserByEmailResponse } from '@/application/usecases/app/get-user-by-email/ports'
import { SchemaValidatorStub } from '@/infra/adapters/validation/schemas/stub/schema-validator-stub'
import { InexistentRegisteredUser } from '@/application/errors'
import { notFound, ok } from '@/presentation/helpers/http-helpers'
import { GetUserByEmailController } from './get-user-by-email-controller'

type Sut = {
  sut: GetUserByEmailController
  getUserByEmailUseCase: UseCase
  getUserByEmailSchemaValidator: SchemaValidator
}

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

function makeSut(): Sut {
  const getUserByEmailUseCase = makeGetUserByEmailSub()
  const getUserByEmailSchemaValidator = new SchemaValidatorStub()
  const sut = new GetUserByEmailController(
    getUserByEmailUseCase,
    getUserByEmailSchemaValidator,
  )
  return { sut, getUserByEmailUseCase, getUserByEmailSchemaValidator }
}

describe('GetUserByEmailController', () => {
  const httpRequest = { params: { email: 'any_email' } }

  it('should return 404 if there is not a user with the given email', async () => {
    const { sut, getUserByEmailUseCase } = makeSut()
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
    const { sut, getUserByEmailSchemaValidator } = makeSut()
    vi.spyOn(getUserByEmailSchemaValidator, 'validate').mockImplementation(
      () => {
        throw new Error('any_error')
      },
    )

    expect(sut.handle(httpRequest)).rejects.toThrow(new Error('any_error'))
  })

  it('should throw the error if is not a known error', async () => {
    const { sut, getUserByEmailUseCase } = makeSut()
    vi.spyOn(getUserByEmailUseCase, 'execute').mockRejectedValue(
      new Error('any_error'),
    )

    expect(sut.handle(httpRequest)).rejects.toThrow(new Error('any_error'))
  })

  it('should return 200 and the user data on success', async () => {
    const { sut } = makeSut()

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
