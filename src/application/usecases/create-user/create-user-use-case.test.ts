import { vi, describe, it, expect } from 'vitest'

import type { CreateUser } from '@/domain/usecases/create-user'
import type { UserRepository } from '@/application/repositories/user-repository'
import type { PasswordEncryptor } from '@/infra/adapters/password-encryptor/ports'
import { HashingPasswordError } from '@/infra/adapters/password-encryptor/errors'
import { InMemoryUserRepository } from '@/infra/repositories/in-memory/in-memory-user-repository'
import { CreateUserUseCase } from './create-user-use-case'
import { EmailAlreadyBeingUsedError } from './errors'

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
  sut: CreateUser
  userRepository: UserRepository
  passwordEncryptorStub: PasswordEncryptor
}

function makeSut(): Sut {
  const passwordEncryptorStub = makePasswordEncryptorStub()
  const userRepository = new InMemoryUserRepository()
  const sut = new CreateUserUseCase(userRepository, passwordEncryptorStub)
  return { sut, passwordEncryptorStub, userRepository }
}

describe('CreateUserUseCase', () => {
  it('should throw an error if already has a user registered with the same email', async () => {
    const { sut } = makeSut()
    const input = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    }
    await sut.execute(input)

    await expect(sut.execute(input)).rejects.toThrowError(
      new EmailAlreadyBeingUsedError('any_email'),
    )
  })

  it('should throw an error if the password hashing fails', async () => {
    const { sut, passwordEncryptorStub } = makeSut()
    vi.spyOn(passwordEncryptorStub, 'hashPassword').mockRejectedValueOnce(
      new HashingPasswordError('any_error'),
    )
    const input = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    }

    await expect(sut.execute(input)).rejects.toThrowError(
      new HashingPasswordError('any_error'),
    )
  })
})
