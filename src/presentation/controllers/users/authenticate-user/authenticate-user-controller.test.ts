import type { UseCase } from '@/core/use-case'
import type { AuthenticateUserResponse } from '@/application/usecases/users/authenticate-user/ports'
import { InvalidPasswordError } from '@/application/usecases/users/authenticate-user/errors'
import { InexistentRegisteredUser } from '@/application/errors'
import type { SchemaValidator } from '@/infra/adapters/validation/schemas/ports'
import { SchemaValidatorStub } from '@/infra/adapters/validation/schemas/stub/schema-validator-stub'
import { SchemaParseFailedError } from '@/infra/adapters/validation/errors'
import { AuthenticateUserController } from './authenticate-user-controller'

type Sut = {
  sut: AuthenticateUserController
  authenticateUserUseCase: UseCase
  authenticateUserSchemaValidator: SchemaValidator
}

function makeAuthenticateUserUseCaseSub(): UseCase {
  class AuthenticateUserUseCaseStub implements UseCase {
    async execute(): Promise<AuthenticateUserResponse> {
      return Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        createdAt: new Date().toString(),
      })
    }
  }
  return new AuthenticateUserUseCaseStub()
}

function makeSut(): Sut {
  const authenticateUserUseCase = makeAuthenticateUserUseCaseSub()
  const authenticateUserSchemaValidator = new SchemaValidatorStub()
  const sut = new AuthenticateUserController(
    authenticateUserUseCase,
    authenticateUserSchemaValidator,
  )
  return { sut, authenticateUserUseCase, authenticateUserSchemaValidator }
}

describe('AuthenticateUserController', () => {
  const httpRequest = {
    body: {
      email: 'any_email',
      password: 'any_password',
    },
  }

  it('should return 404 if there is not a user with the given email', async () => {
    const { sut, authenticateUserUseCase } = makeSut()
    vi.spyOn(authenticateUserUseCase, 'execute').mockRejectedValue(
      new InexistentRegisteredUser('email'),
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: `There's no registered user with these email`,
    })
  })

  it('should return 400 if user passes the wrong password', async () => {
    const { sut, authenticateUserUseCase } = makeSut()
    vi.spyOn(authenticateUserUseCase, 'execute').mockRejectedValue(
      new InvalidPasswordError(),
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'Invalid password',
    })
  })

  it('should throw a schema validation error', async () => {
    const { sut, authenticateUserSchemaValidator } = makeSut()
    vi.spyOn(authenticateUserSchemaValidator, 'validate').mockImplementation(
      () => {
        throw new SchemaParseFailedError('any_error')
      },
    )

    expect(sut.handle(httpRequest)).rejects.toThrow(
      new SchemaParseFailedError('any_error'),
    )
  })

  it('should throw the error if is not a known error', async () => {
    const { sut, authenticateUserUseCase } = makeSut()
    vi.spyOn(authenticateUserUseCase, 'execute').mockRejectedValue(
      new Error('any_error'),
    )

    expect(sut.handle(httpRequest)).rejects.toThrow(new Error('any_error'))
  })

  it('should return 200 and the authenticated user data on success', async () => {
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
