import { vi, describe, it, expect } from 'vitest'

import type { PasswordEncryptor } from '@/infra/adapters/password-encryptor/ports'
import { HashingPasswordError } from '@/infra/adapters/password-encryptor/errors'
import { InMemoryUserRepository } from '@/infra/repositories/in-memory/in-memory-user-repository'
import { GetUserByEmailUseCase } from '../get-user-by-email/get-user-by-email-use-case'
import { EmailAlreadyBeingUsedError } from './errors'
import { CreateUserUseCase } from './create-user-use-case'

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
  sut: CreateUserUseCase
  getUserByEmailUseCase: GetUserByEmailUseCase
  passwordEncryptorStub: PasswordEncryptor
}

function makeSut(): Sut {
  const passwordEncryptorStub = makePasswordEncryptorStub()
  const userRepository = new InMemoryUserRepository()
  const sut = new CreateUserUseCase(userRepository, passwordEncryptorStub)
  const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository)
  return { sut, passwordEncryptorStub, getUserByEmailUseCase }
}

describe('CreateUserUseCase', () => {
  const request = {
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
  }

  it('should throw an error if already has a user registered with the same email', async () => {
    const { sut } = makeSut()
    await sut.execute(request)

    await expect(sut.execute(request)).rejects.toThrowError(
      new EmailAlreadyBeingUsedError('any_email'),
    )
  })

  it('should throw an error if the password hashing fails', async () => {
    const { sut, passwordEncryptorStub } = makeSut()
    vi.spyOn(passwordEncryptorStub, 'hashPassword').mockRejectedValue(
      new HashingPasswordError('any_error'),
    )

    await expect(sut.execute(request)).rejects.toThrowError(
      new HashingPasswordError('any_error'),
    )
  })
})
