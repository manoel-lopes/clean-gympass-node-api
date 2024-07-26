import { vi, describe, it, expect } from 'vitest'

import type { PasswordEncryptor } from '@/infra/adapters/password-encryptor/ports'
import {
  HashingPasswordError,
  VerifyPasswordError,
} from '@/infra/adapters/password-encryptor/errors'
import { InMemoryUsersRepository } from '@/infra/repositories/in-memory/in-memory-users-repository'
import { PasswordEncryptorStub } from '@/infra/adapters/password-encryptor/stub/password-encryptor-stub'
import { GetUserByEmailUseCase } from '../get-user-by-email/get-user-by-email-use-case'
import { EmailAlreadyBeingUsedError } from './errors'
import { CreateUserUseCase } from './create-user-use-case'

type Sut = {
  sut: CreateUserUseCase
  getUserByEmailUseCase: GetUserByEmailUseCase
  passwordEncryptorStub: PasswordEncryptor
}

function makeSut(): Sut {
  const UsersRepository = new InMemoryUsersRepository()
  const passwordEncryptorStub = new PasswordEncryptorStub()
  const sut = new CreateUserUseCase(UsersRepository, passwordEncryptorStub)
  const getUserByEmailUseCase = new GetUserByEmailUseCase(UsersRepository)
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

  it('should throw an error if the password verification fails', async () => {
    const { sut, passwordEncryptorStub } = makeSut()
    vi.spyOn(passwordEncryptorStub, 'hashPassword').mockRejectedValue(
      new VerifyPasswordError('any_error'),
    )

    await expect(sut.execute(request)).rejects.toThrowError(
      new VerifyPasswordError('any_error'),
    )
  })

  it('should correctly create a new user', async () => {
    const { sut, getUserByEmailUseCase, passwordEncryptorStub } = makeSut()
    const passwordEncryptorSpy = vi.spyOn(passwordEncryptorStub, 'hashPassword')

    await sut.execute(request)
    const user = await getUserByEmailUseCase.execute({ email: 'any_email' })

    expect(passwordEncryptorSpy).toHaveBeenCalledWith('any_password')
    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toBe('any_name')
    expect(user.email).toBe('any_email')
    expect(new Date(user.createdAt).getTime()).not.toBeNaN()
  })
})
