import { vi, describe, it, expect } from 'vitest'

import { CreateUserUseCase } from '@/application/usecases/users'
import { InexistentRegisteredUser } from '@/application/errors'
import type { PasswordEncryptor } from '@/infra/adapters/password-encryptor/ports'
import { InMemoryUserRepository } from '@/infra/repositories/in-memory/in-memory-user-repository'
import { PasswordEncryptorStub } from '@/infra/adapters/password-encryptor/stub/password-encryptor-stub'
import { AuthenticateUserUseCase } from './authenticate-user-use-case'
import { InvalidPasswordError } from './errors'

type Sut = {
  sut: AuthenticateUserUseCase
  createUserUseCase: CreateUserUseCase
  passwordEncryptorStub: PasswordEncryptor
}

function makeSut(): Sut {
  const passwordEncryptorStub = new PasswordEncryptorStub()
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
      new InexistentRegisteredUser('email'),
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
})
