import { InMemoryUsersRepository } from '@/infra/repositories/in-memory/in-memory-users-repository'
import { InexistentRegisteredUser } from '@/application/errors'
import { GetUserByEmailUseCase } from './get-user-by-email-use-case'

describe('GetUserByEmailUseCase', () => {
  let sut: GetUserByEmailUseCase
  beforeEach(async () => {
    const usersRepository = new InMemoryUsersRepository()
    sut = new GetUserByEmailUseCase(usersRepository)
  })

  it('should throw an error if there is not a registered user with the given email', () => {
    const email = 'any_non_existing_email'

    expect(sut.execute({ email })).rejects.toThrowError(
      new InexistentRegisteredUser('email'),
    )
  })
})
