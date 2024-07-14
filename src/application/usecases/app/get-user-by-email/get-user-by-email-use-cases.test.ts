import { describe, it, expect } from 'vitest'

import type { UseCase } from '@/core/use-case'
import { InMemoryUserRepository } from '@/infra/repositories/in-memory/in-memory-user-repository'
import { GetUserByEmailUseCase } from './get-user-by-email-use-case'
import { InexistentRegisteredUserWithEmailError } from '@/application/errors'

type Sut = {
  sut: UseCase
}

function makeSut(): Sut {
  const userRepository = new InMemoryUserRepository()
  const sut = new GetUserByEmailUseCase(userRepository)
  return { sut }
}

describe('GetUserByEmailUseCase', () => {
  it('should throw an error if there is not a user with the given email', () => {
    const email = 'any_email'
    const { sut } = makeSut()

    expect(sut.execute({ email })).rejects.toThrowError(
      new InexistentRegisteredUserWithEmailError(email),
    )
  })
})
