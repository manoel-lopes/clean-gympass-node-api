import type { UseCase } from '@/core/use-case'
import { EmailAlreadyBeingUsedError } from '@/application/usecases/users/create-user/errors'
import type { SchemaValidator } from '@/infra/adapters/validation/schemas/ports'
import { SchemaValidatorStub } from '@/infra/adapters/validation/schemas/stub/schema-validator-stub'
import {
  HashingPasswordError,
  VerifyPasswordError,
} from '@/infra/adapters/password-encryptor/errors'
import { SchemaParseFailedError } from '@/infra/adapters/validation/errors'
import { CreateUserController } from './create-user-controller'

function makeCreateUserSub(): UseCase {
  class CreateUserStub implements UseCase {
    async execute(): Promise<void> {
      return Promise.resolve()
    }
  }
  return new CreateUserStub()
}

describe('CreateUserController', () => {
  let createUserUseCase: UseCase
  let createUserSchemaValidator: SchemaValidator
  let sut: CreateUserController
  const httpRequest = {
    body: {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    },
  }
  beforeEach(() => {
    createUserUseCase = makeCreateUserSub()
    createUserSchemaValidator = new SchemaValidatorStub()
    sut = new CreateUserController(createUserUseCase, createUserSchemaValidator)
  })

  it('should return 409 if already has a user registered with the same email', async () => {
    vi.spyOn(createUserUseCase, 'execute').mockRejectedValue(
      new EmailAlreadyBeingUsedError('any_email'),
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(409)
    expect(httpResponse.body).toEqual({
      error: 'Conflict',
      message: `The email 'any_email' is already being used`,
    })
  })

  it('should return 400 if password hashing fails', async () => {
    vi.spyOn(createUserUseCase, 'execute').mockRejectedValue(
      new HashingPasswordError('any_error'),
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'Error hashing password: any_error',
    })
  })

  it('should return 400 if verify password fails', async () => {
    vi.spyOn(createUserUseCase, 'execute').mockRejectedValue(
      new VerifyPasswordError('any_error'),
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'Error verifying password: any_error',
    })
  })

  it('should throw a schema validation error', async () => {
    vi.spyOn(createUserSchemaValidator, 'validate').mockImplementation(() => {
      throw new SchemaParseFailedError('any_error')
    })

    expect(sut.handle(httpRequest)).rejects.toThrow(
      new SchemaParseFailedError('any_error'),
    )
  })

  it('should throw the error if is not a known error', async () => {
    vi.spyOn(createUserUseCase, 'execute').mockRejectedValue(
      new Error('any_error'),
    )

    expect(sut.handle(httpRequest)).rejects.toThrow(new Error('any_error'))
  })

  it('should return 201 on success', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(201)
  })
})
