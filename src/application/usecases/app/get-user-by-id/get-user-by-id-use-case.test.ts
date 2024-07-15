import { describe, it, expect } from 'vitest'

import { InMemoryUserRepository } from '@/infra/repositories/in-memory/in-memory-user-repository'
import type { PasswordEncryptor } from '@/infra/adapters/password-encryptor/ports'
import { InexistentRegisteredUser } from '@/application/errors'
import { AuthenticateUserUseCase } from '@/application/usecases/auth/authenticate-user/authenticate-user-use-case'
import { CreateUserUseCase } from '../create-user/create-user-use-case'
import { GetUserByIdUseCase } from './get-user-by-id-use-case'

type Sut = {
  sut: GetUserByIdUseCase
  createUserUseCase: CreateUserUseCase
  authenticate: AuthenticateUserUseCase
}

function makePasswordEncryptorStub(): PasswordEncryptor {
  class PasswordEncryptorStub implements PasswordEncryptor {
    async hashPassword(): Promise<string> {
      return 'hashed_password'
    }

    async verifyPassword(): Promise<boolean> {
      return true
    }
  }
  return new PasswordEncryptorStub()
}

function makeSut(): Sut {
  const userRepository = new InMemoryUserRepository()
  const passwordEncryptor = makePasswordEncryptorStub()
  const sut = new GetUserByIdUseCase(userRepository)
  const createUserUseCase = new CreateUserUseCase(
    userRepository,
    passwordEncryptor,
  )
  const authenticate = new AuthenticateUserUseCase(
    userRepository,
    passwordEncryptor,
  )
  return { sut, createUserUseCase, authenticate }
}

describe('GetUserByIdUseCase', () => {
  it('should throw an error if there is not a registered user with the given email', () => {
    const userId = 'any_non_existing_user_id'
    const { sut } = makeSut()

    expect(sut.execute({ userId })).rejects.toThrowError(
      new InexistentRegisteredUser('id'),
    )
  })

  it('should correctly return the user data', async () => {
    const { sut, createUserUseCase, authenticate } = makeSut()

    await createUserUseCase.execute({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    })

    const { id: userId } = await authenticate.execute({
      email: 'any_email',
      password: 'any_password',
    })

    const user = await sut.execute({ userId })

    expect(user.id).toBe(userId)
    expect(user.name).toBe('any_name')
    expect(user.email).toBe('any_email')
    expect(new Date(user.createdAt).getTime()).not.toBeNaN()
  })
})
