import { describe, it, expect } from 'vitest'

import { InMemoryUsersRepository } from '@/infra/repositories/in-memory/in-memory-users-repository'
import { InexistentRegisteredUser } from '@/application/errors'
import { GetUserByIdUseCase } from './get-user-by-id-use-case'

describe('GetUserByIdUseCase', () => {
  let sut: GetUserByIdUseCase
  const userId = 'any_id'
  beforeEach(async () => {
    const usersRepository = new InMemoryUsersRepository()
    sut = new GetUserByIdUseCase(usersRepository)
    await usersRepository.save({
      id: userId,
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    })
  })

  it('should throw an error if there is not a registered user with the given user id', () => {
    expect(
      sut.execute({ userId: 'any_non_existing_user_id' }),
    ).rejects.toThrowError(new InexistentRegisteredUser('id'))
  })

  it('should correctly return the user data', async () => {
    const user = await sut.execute({ userId })

    expect(user.id).toBe(userId)
    expect(user.name).toBe('any_name')
    expect(user.email).toBe('any_email')
    expect(new Date(user.createdAt).getTime()).not.toBeNaN()
  })
})
