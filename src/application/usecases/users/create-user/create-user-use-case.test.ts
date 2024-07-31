import { vi, describe, it, expect } from 'vitest'

import { GetUserByEmailUseCase } from '@/application/usecases/users'
import { PasswordEncryptorStub } from '@/infra/adapters/password-encryptor/stub/password-encryptor-stub'
import type { PasswordEncryptor } from '@/infra/adapters/password-encryptor/ports'
import { InMemoryUsersRepository } from '@/infra/repositories/in-memory/in-memory-users-repository'
import {
  HashingPasswordError,
  VerifyPasswordError,
} from '@/infra/adapters/password-encryptor/errors'
import { EmailAlreadyBeingUsedError } from './errors'
import { CreateUserUseCase } from './create-user-use-case'

describe('CreateUserUseCase', () => {
  let getUserByEmailUseCase: GetUserByEmailUseCase
  let passwordEncryptorStub: PasswordEncryptor
  let sut: CreateUserUseCase
  const request = {
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
  }
  beforeEach(() => {
    const usersRepository = new InMemoryUsersRepository()
    passwordEncryptorStub = new PasswordEncryptorStub()
    getUserByEmailUseCase = new GetUserByEmailUseCase(usersRepository)
    sut = new CreateUserUseCase(usersRepository, passwordEncryptorStub)
  })

  it('should throw an error if already has a user registered with the same email', async () => {
    await sut.execute(request)

    await expect(sut.execute(request)).rejects.toThrowError(
      new EmailAlreadyBeingUsedError('any_email'),
    )
  })

  it('should throw an error if the password hashing fails', async () => {
    vi.spyOn(passwordEncryptorStub, 'hashPassword').mockRejectedValue(
      new HashingPasswordError('any_error'),
    )

    await expect(sut.execute(request)).rejects.toThrowError(
      new HashingPasswordError('any_error'),
    )
  })

  it('should throw an error if the password verification fails', async () => {
    vi.spyOn(passwordEncryptorStub, 'hashPassword').mockRejectedValue(
      new VerifyPasswordError('any_error'),
    )

    await expect(sut.execute(request)).rejects.toThrowError(
      new VerifyPasswordError('any_error'),
    )
  })

  it('should correctly create a new user', async () => {
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
