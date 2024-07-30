import type { UseCase } from '@/core/use-case'
import type { GetUserByIdResponse } from '@/application/usecases/users/get-user-by-id/ports'
import { InexistentRegisteredUser } from '@/application/errors'
import type { SchemaValidator } from '@/infra/adapters/validation/schemas/ports'
import { SchemaValidatorStub } from '@/infra/adapters/validation/schemas/stub/schema-validator-stub'
import { SchemaParseFailedError } from '@/infra/adapters/validation/errors'
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
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: `There's no registered user with these id`,
    })
  })

  it('should throw a schema validation error', async () => {
    const { sut, getUserByIdSchemaValidator } = makeSut()
    vi.spyOn(getUserByIdSchemaValidator, 'validate').mockImplementation(() => {
      throw new SchemaParseFailedError('any_error')
    })

    expect(sut.handle(httpRequest)).rejects.toThrow(
      new SchemaParseFailedError('any_error'),
    )
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

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      createdAt: new Date().toString(),
    })
  })
})
