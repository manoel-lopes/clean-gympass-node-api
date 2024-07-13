import { vi, describe, it, expect } from 'vitest'

import type { CreateUser } from '@/domain/usecases/create-user'
import type { PasswordEncryptor } from '@/infra/adapters/password-encryptor/ports'
import { HashingPasswordError } from '@/infra/adapters/password-encryptor/errors'
import { InMemoryUserRepository } from '@/infra/repositories/in-memory/in-memory-user-repository'
import { CreateUserUseCase } from './create-user-use-case'
import { EmailAlreadyBeingUsedError } from './errors'
import type { GetUserByEmail } from '@/domain/usecases/get-user-by-email'
import { GetUserByEmailUseCase } from '../get-user-by-email/get-user-by-email-use-case'

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
  getUserByEmailUseCase: GetUserByEmail
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
    vi.spyOn(passwordEncryptorStub, 'hashPassword').mockRejectedValue(
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

  it('should correctly create a new user', async () => {
    const input = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    }
    const { sut, getUserByEmailUseCase, passwordEncryptorStub } = makeSut()
    const passwordEncryptorSpy = vi.spyOn(passwordEncryptorStub, 'hashPassword')

    await sut.execute(input)
    const user = await getUserByEmailUseCase.execute('any_email')

    expect(passwordEncryptorSpy).toHaveBeenCalledWith('any_password')
    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toBe('any_name')
    expect(user.email).toBe('any_email')
    expect(new Date(user.createdAt ?? '').getTime()).not.toBeNaN()
  })
})
