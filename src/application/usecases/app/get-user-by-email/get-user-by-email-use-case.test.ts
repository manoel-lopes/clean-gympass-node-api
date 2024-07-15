import { describe, it, expect } from 'vitest'

import { InMemoryUserRepository } from '@/infra/repositories/in-memory/in-memory-user-repository'
import { InexistentRegisteredUserWithEmailError } from '@/application/errors'
import { GetUserByEmailUseCase } from './get-user-by-email-use-case'

type Sut = {
  sut: GetUserByEmailUseCase
}

function makeSut(): Sut {
  const userRepository = new InMemoryUserRepository()
  const sut = new GetUserByEmailUseCase(userRepository)
  return { sut }
}

describe('GetUserByEmailUseCase', () => {
  it('should throw an error if there is not a registered user with the given email', () => {
    const email = 'any_non_existing_email'
    const { sut } = makeSut()

    expect(sut.execute({ email })).rejects.toThrowError(
      new InexistentRegisteredUserWithEmailError(email),
    )
  })
})
