import { vi, describe, it, expect } from 'vitest'

import { CreateUserUseCase } from '@/application/usecases/app/create-user/create-user-use-case'
import { InexistentRegisteredUserWithEmailError } from '@/application/errors'
import type { PasswordEncryptor } from '@/infra/adapters/password-encryptor/ports'
import { InMemoryUserRepository } from '@/infra/repositories/in-memory/in-memory-user-repository'
import { AuthenticateUserUseCase } from './authenticate-user-use-case'
import { InvalidPasswordError } from './errors'

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

type Sut = {
  sut: AuthenticateUserUseCase
  createUserUseCase: CreateUserUseCase
  passwordEncryptorStub: PasswordEncryptor
}

function makeSut(): Sut {
  const passwordEncryptorStub = makePasswordEncryptorStub()
  const userRepository = new InMemoryUserRepository()

  const createUserUseCase = new CreateUserUseCase(
    userRepository,
    passwordEncryptorStub,
  )
  const sut = new AuthenticateUserUseCase(userRepository, passwordEncryptorStub)
  return {
    sut,
    createUserUseCase,
    passwordEncryptorStub,
  }
}

describe('AuthenticateUserUseCase', () => {
  const request = {
    email: 'any_email',
    password: 'any_password',
  }

  it('should throw an error if there is not a registered user with the given email', () => {
    const { sut } = makeSut()

    expect(sut.execute(request)).rejects.toThrowError(
      new InexistentRegisteredUserWithEmailError(request.email),
    )
  })

  it('should throw an error if the given password does not match the stored password', async () => {
    const { sut, createUserUseCase, passwordEncryptorStub } = makeSut()
    await createUserUseCase.execute({ name: 'any_name', ...request })
    vi.spyOn(passwordEncryptorStub, 'verifyPassword').mockResolvedValueOnce(
      false,
    )

    await expect(sut.execute(request)).rejects.toThrowError(
      new InvalidPasswordError(),
    )
  })

  it('should correctly authenticate a user', async () => {
    const { sut, createUserUseCase } = makeSut()
    await createUserUseCase.execute({ name: 'any_name', ...request })

    const user = await sut.execute(request)
    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toBe('any_name')
    expect(user.email).toBe('any_email')
    expect(new Date(user.createdAt).getTime()).not.toBeNaN()
  })
})
