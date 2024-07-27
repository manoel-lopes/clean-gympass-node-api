import { InMemoryUsersRepository } from '@/infra/repositories/in-memory/in-memory-users-repository'
import { InMemoryCheckInsRepository } from '@/infra/repositories/in-memory/in-memory-check-ins-repository'
import { InexistentRegisteredUser } from '@/application/errors'
import { GetUserCheckInsHistoryUseCase } from './get-user-check-ins-history-use-case'

type Sut = {
  sut: GetUserCheckInsHistoryUseCase
}

function makeSut(): Sut {
  const usersRepository = new InMemoryUsersRepository()
  const checkInsRepository = new InMemoryCheckInsRepository()
  const sut = new GetUserCheckInsHistoryUseCase(
    usersRepository,
    checkInsRepository,
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
