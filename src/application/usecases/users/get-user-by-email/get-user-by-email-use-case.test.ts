import { describe, it, expect } from 'vitest'

import { InMemoryUsersRepository } from '@/infra/repositories/in-memory/in-memory-users-repository'
import { InexistentRegisteredUser } from '@/application/errors'
import { GetUserByEmailUseCase } from './get-user-by-email-use-case'

type Sut = {
  sut: GetUserByEmailUseCase
}

function makeSut(): Sut {
  const UsersRepository = new InMemoryUsersRepository()
  const sut = new GetUserByEmailUseCase(UsersRepository)
  return { sut }
}

describe('GetUserByEmailUseCase', () => {
  it('should throw an error if there is not a registered user with the given email', () => {
    const email = 'any_non_existing_email'
    const { sut } = makeSut()

    expect(sut.execute({ email })).rejects.toThrowError(
      new InexistentRegisteredUser('email'),
    )
  })
})
