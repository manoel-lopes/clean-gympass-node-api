import { InMemoryUserRepository } from '@/infra/repositories/in-memory/in-memory-user-repository'
import { InMemoryCheckInRepository } from '@/infra/repositories/in-memory/in-memory-check-in-repository'
import { InexistentRegisteredUser } from '@/application/errors'
import { GetUserCheckInsHistoryUseCase } from './get-user-check-ins-history-use-case'

type Sut = {
  sut: GetUserCheckInsHistoryUseCase
}

function makeSut(): Sut {
  const userRepository = new InMemoryUserRepository()
  const checkInRepository = new InMemoryCheckInRepository()
  const sut = new GetUserCheckInsHistoryUseCase(
    userRepository,
    checkInRepository,
  )
  return { sut }
}

describe('GetUserCheckInsHistoryUseCase', () => {
  it('should throw an error if there is not a registered user with the given user id', () => {
    const userId = 'any_non_existing_user_id'
    const { sut } = makeSut()

    expect(sut.execute({ userId })).rejects.toThrowError(
      new InexistentRegisteredUser('id'),
    )
  })
})
