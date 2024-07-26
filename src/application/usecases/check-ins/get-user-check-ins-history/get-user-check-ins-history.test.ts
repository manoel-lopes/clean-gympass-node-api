import { InMemoryUsersRepository } from '@/infra/repositories/in-memory/in-memory-users-repository'
import { InMemoryCheckInRepository } from '@/infra/repositories/in-memory/in-memory-check-in-repository'
import { InexistentRegisteredUser } from '@/application/errors'
import { GetUserCheckInsHistoryUseCase } from './get-user-check-ins-history-use-case'

type Sut = {
  sut: GetUserCheckInsHistoryUseCase
}

function makeSut(): Sut {
  const UsersRepository = new InMemoryUsersRepository()
  const checkInRepository = new InMemoryCheckInRepository()
  const sut = new GetUserCheckInsHistoryUseCase(
    UsersRepository,
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
