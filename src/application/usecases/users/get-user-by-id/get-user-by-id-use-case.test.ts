import { describe, it, expect } from 'vitest'

import { InMemoryUsersRepository } from '@/infra/repositories/in-memory/in-memory-users-repository'
import { PasswordEncryptorStub } from '@/infra/adapters/password-encryptor/stub/password-encryptor-stub'
import { InexistentRegisteredUser } from '@/application/errors'
import {
  CreateUserUseCase,
  AuthenticateUserUseCase,
} from '@/application/usecases/users'
import { GetUserByIdUseCase } from './get-user-by-id-use-case'

type Sut = {
  sut: GetUserByIdUseCase
  createUserUseCase: CreateUserUseCase
  authenticateUserUseCase: AuthenticateUserUseCase
}

function makeSut(): Sut {
  const UsersRepository = new InMemoryUsersRepository()
  const passwordEncryptor = new PasswordEncryptorStub()
  const sut = new GetUserByIdUseCase(UsersRepository)
  const createUserUseCase = new CreateUserUseCase(
    UsersRepository,
    passwordEncryptor,
  )
  const authenticateUserUseCase = new AuthenticateUserUseCase(
    UsersRepository,
    passwordEncryptor,
  )
  return { sut, createUserUseCase, authenticateUserUseCase }
}

describe('GetUserByIdUseCase', () => {
  it('should throw an error if there is not a registered user with the given user id', () => {
    const userId = 'any_non_existing_user_id'
    const { sut } = makeSut()

    expect(sut.execute({ userId })).rejects.toThrowError(
      new InexistentRegisteredUser('id'),
    )
  })

  it('should correctly return the user data', async () => {
    const { sut, createUserUseCase, authenticateUserUseCase } = makeSut()

    await createUserUseCase.execute({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    })

    const { id: userId } = await authenticateUserUseCase.execute({
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
