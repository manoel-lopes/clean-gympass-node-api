import { vi, describe, it, expect } from 'vitest'

import { InexistentRegisteredUser } from '@/application/errors'
import type { PasswordHashingProvider } from '@/infra/providers/cryptography/ports'
import { InMemoryUsersRepository } from '@/infra/repositories/in-memory/in-memory-users-repository'
import { PasswordHashingStubProvider } from '@/infra/providers/cryptography/password-hashing/stub/password-hashing-stub.provider'
import { AuthenticateUserUseCase } from './authenticate-user-use-case'
import { InvalidPasswordError } from './errors'

describe('AuthenticateUserUseCase', () => {
  let passwordHashingProvider: PasswordHashingProvider
  let sut: AuthenticateUserUseCase
  const request = { email: 'any_email', password: 'any_password' }

  beforeEach(async () => {
    const usersRepository = new InMemoryUsersRepository()
    passwordHashingProvider = new PasswordHashingStubProvider()
    sut = new AuthenticateUserUseCase(usersRepository, passwordHashingProvider)
    await usersRepository.save({ name: 'any_name', ...request })
  })

  it('should throw an error if there is not a registered user with the given email', () => {
    expect(
      sut.execute({ ...request, email: 'any_non_existent_user_email' }),
    ).rejects.toThrowError(new InexistentRegisteredUser('email'))
  })

  it('should throw an error if the given password does not match the stored password', async () => {
    vi.spyOn(passwordHashingProvider, 'compare').mockResolvedValueOnce(false)

    await expect(sut.execute(request)).rejects.toThrowError(
      new InvalidPasswordError(),
    )
  })

  it('should correctly authenticate an user', async () => {
    const user = await sut.execute(request)

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toBe('any_name')
    expect(user.email).toBe(request.email)
    expect(new Date(user.createdAt).getTime()).not.toBeNaN()
  })
})
