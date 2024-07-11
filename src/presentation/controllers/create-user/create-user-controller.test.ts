import { vi, describe, it, expect } from 'vitest'

import type { User } from '@/domain/models/user'
import type { CreateUser } from '@/domain/usecases/create-user'
import type { CreateUserSchemaValidator } from '@/application/validation/schema/create-user-schema-validator'
import { EmailAlreadyBeingUsedError } from '@/application/usecases/app/create-user/errors'
import {
  badRequest,
  conflict,
  created,
} from '@/presentation/helpers/http-helpers'
import { HashingPasswordError } from '@/infra/adapters/password-encryptor/errors'
import { CreateUserController } from './create-user-controller'

type Sut = {
  sut: CreateUserController
  createUserUseCase: CreateUser
  createUserSchemaValidator: CreateUserSchemaValidator
}

function makeCreateUserSub(): CreateUser {
  class CreateUserStub implements CreateUser {
    async execute(): Promise<void> {
      return Promise.resolve()
    }
  }
  return new CreateUserStub()
}

function makeCreateUserSchemaValidatorStub(): CreateUserSchemaValidator {
  class CreateUserSchemaValidatorStub implements CreateUserSchemaValidator {
    validate(): User {
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
    vi.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(
      new EmailAlreadyBeingUsedError('any_email'),
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(
      conflict(new EmailAlreadyBeingUsedError('any_email')),
    )
  })

  it('should return 400 if password hashing fails', async () => {
    const { sut, createUserUseCase } = makeSut()
    vi.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(
      new HashingPasswordError('any_error'),
    )

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(
      badRequest(new HashingPasswordError('any_error')),
    )
  })

  it('should throw the error if is not a known error', async () => {
    const { sut, createUserUseCase } = makeSut()
    vi.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(
      new Error('any_error'),
    )

    expect(sut.handle(httpRequest)).rejects.toThrow(new Error('any_error'))
  })

  it('should return 201 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(created())
  })
})
