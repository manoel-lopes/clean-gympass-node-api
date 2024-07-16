import type { UseCase } from '@/core/use-case'
import type { SchemaValidator } from '@/infra/adapters/validation/schemas/ports'
import type { GetUserByIdResponse } from '@/application/usecases/users/get-user-by-id/ports'
import { SchemaValidatorStub } from '@/infra/adapters/validation/schemas/stub/schema-validator-stub'
import { InexistentRegisteredUser } from '@/application/errors'
import { notFound, ok } from '@/presentation/helpers/http-helpers'
import { GetUserByIdController } from './get-user-by-id-controller'

type Sut = {
  sut: GetUserByIdController
  getUserByIdUseCase: UseCase
  getUserByIdSchemaValidator: SchemaValidator
}

function makeGetUserByIdSub(): UseCase {
  class GetUserByIdStub implements UseCase {
    async execute(): Promise<GetUserByIdResponse> {
      return Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        createdAt: new Date().toString(),
      })
    }
  }
  return new GetUserByIdStub()
}

function makeSut(): Sut {
  const getUserByIdUseCase = makeGetUserByIdSub()
  const getUserByIdSchemaValidator = new SchemaValidatorStub()
  const sut = new GetUserByIdController(
    getUserByIdUseCase,
    getUserByIdSchemaValidator,
  )
  return { sut, getUserByIdUseCase, getUserByIdSchemaValidator }
}

describe('GetUserByIdController', () => {
  const httpRequest = { params: { userId: 'any_Id' } }

  it('should return 404 if there is not a user with the given user id', async () => {
    const { sut, getUserByIdUseCase } = makeSut()
    vi.spyOn(getUserByIdUseCase, 'execute').mockRejectedValue(
      new InexistentRegisteredUser('id'),
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse).toEqual(notFound(new InexistentRegisteredUser('id')))
  })

  it('should throw a schema validation error', async () => {
    const { sut, getUserByIdSchemaValidator } = makeSut()
    vi.spyOn(getUserByIdSchemaValidator, 'validate').mockImplementation(() => {
      throw new Error('any_error')
    })

    expect(sut.handle(httpRequest)).rejects.toThrow(new Error('any_error'))
  })

  it('should throw the error if is not a known error', async () => {
    const { sut, getUserByIdUseCase } = makeSut()
    vi.spyOn(getUserByIdUseCase, 'execute').mockRejectedValue(
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
