import type { UseCase } from '@/core/use-case'
import type { CreateUserRequest } from '@/application/usecases/app/create-user/ports'
import type { CreateUserSchemaValidator } from '@/application/validation/schema/create-user-schema-validator'
import { EmailAlreadyBeingUsedError } from '@/application/usecases/app/create-user/errors'
import { HashingPasswordError } from '@/infra/adapters/password-encryptor/errors'
import {
  badRequest,
  conflict,
  created,
} from '@/presentation/helpers/http-helpers'
import { CreateUserController } from './create-user-controller'

type Sut = {
  sut: CreateUserController
  createUserUseCase: UseCase
  createUserSchemaValidator: CreateUserSchemaValidator
}

function makeCreateUserSub(): UseCase {
  class CreateUserStub implements UseCase {
    async execute(): Promise<void> {
      return Promise.resolve()
    }
  }
  return new CreateUserStub()
}

function makeCreateUserSchemaValidatorStub(): CreateUserSchemaValidator {
  class CreateUserSchemaValidatorStub implements CreateUserSchemaValidator {
    validate(): CreateUserRequest {
      return {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
      }
    }
  }
  return new CreateUserSchemaValidatorStub()
}

function makeSut(): Sut {
  const createUserUseCase = makeCreateUserSub()
  const createUserSchemaValidator = makeCreateUserSchemaValidatorStub()
  const sut = new CreateUserController(
    createUserUseCase,
    createUserSchemaValidator,
  )
  return { sut, createUserUseCase, createUserSchemaValidator }
}

describe('CreateUserController', () => {
  const httpRequest = {
    body: {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    },
  }

  it('should return 409 if already has a user registered with the same email', async () => {
    const { sut, createUserUseCase } = makeSut()
    vi.spyOn(createUserUseCase, 'execute').mockRejectedValue(
      new EmailAlreadyBeingUsedError('any_email'),
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(409)
    expect(httpResponse).toEqual(
      conflict(new EmailAlreadyBeingUsedError('any_email')),
    )
  })

  it('should return 400 if password hashing fails', async () => {
    const { sut, createUserUseCase } = makeSut()
    vi.spyOn(createUserUseCase, 'execute').mockRejectedValue(
      new HashingPasswordError('any_error'),
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse).toEqual(
      badRequest(new HashingPasswordError('any_error')),
    )
  })

  it('should throw a schema validation error', async () => {
    const { sut, createUserSchemaValidator } = makeSut()
    vi.spyOn(createUserSchemaValidator, 'validate').mockImplementation(() => {
      throw new Error('any_error')
    })

    expect(sut.handle(httpRequest)).rejects.toThrow(new Error('any_error'))
  })

  it('should throw the error if is not a known error', async () => {
    const { sut, createUserUseCase } = makeSut()
    vi.spyOn(createUserUseCase, 'execute').mockRejectedValue(
      new Error('any_error'),
    )

    expect(sut.handle(httpRequest)).rejects.toThrow(new Error('any_error'))
  })

  it('should return 201 on success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse).toEqual(created())
  })
})
