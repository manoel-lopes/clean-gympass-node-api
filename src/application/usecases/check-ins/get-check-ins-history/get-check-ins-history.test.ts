import { InMemoryUsersRepository } from '@/infra/repositories/in-memory/in-memory-users-repository'
import { InMemoryCheckInsRepository } from '@/infra/repositories/in-memory/in-memory-check-ins-repository'
import { InexistentRegisteredUser } from '@/application/errors'
import { GetCheckInsHistoryUseCase } from './get-check-ins-history'

describe('GetCheckInsHistoryUseCase', () => {
  let sut: GetCheckInsHistoryUseCase
  beforeEach(() => {
    const usersRepository = new InMemoryUsersRepository()
    const checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetCheckInsHistoryUseCase(usersRepository, checkInsRepository)
  })

  it('should throw an error if there is not a registered user with the given user id', () => {
    const userId = 'any_non_existing_user_id'

    expect(sut.execute({ userId })).rejects.toThrowError(
      new InexistentRegisteredUser('id'),
    )
  })
})
