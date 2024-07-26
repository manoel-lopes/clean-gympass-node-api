import { InMemoryUsersRepository } from '@/infra/repositories/in-memory/in-memory-users-repository'
import { InMemoryCheckInsRepository } from '@/infra/repositories/in-memory/in-memory-check-ins-repository'
import { PasswordEncryptorStub } from '@/infra/adapters/password-encryptor/stub/password-encryptor-stub'
import { InexistentRegisteredUser } from '@/application/errors'
import {
  CreateUserUseCase,
  AuthenticateUserUseCase,
} from '@/application/usecases/users'
import { GetUserCheckInsHistoryUseCase } from '@/application/usecases/check-ins'
import { CreateCheckInUseCase } from './create-check-in-use-case'

type Sut = {
  sut: CreateCheckInUseCase
  getUserCheckInsHistoryUseCase: GetUserCheckInsHistoryUseCase
  createUserUseCase: CreateUserUseCase
  authenticateUserUseCase: AuthenticateUserUseCase
}

function makeSut(): Sut {
  const UsersRepository = new InMemoryUsersRepository()
  const CheckInsRepository = new InMemoryCheckInsRepository()
  const passwordEncryptor = new PasswordEncryptorStub()
  const sut = new CreateCheckInUseCase(UsersRepository, CheckInsRepository)
  const createUserUseCase = new CreateUserUseCase(
    UsersRepository,
    passwordEncryptor,
  )
  const authenticateUserUseCase = new AuthenticateUserUseCase(
    UsersRepository,
    passwordEncryptor,
  )
  const getUserCheckInsHistoryUseCase = new GetUserCheckInsHistoryUseCase(
    UsersRepository,
    CheckInsRepository,
  )
  return {
    sut,
    getUserCheckInsHistoryUseCase,
    createUserUseCase,
    authenticateUserUseCase,
  }
}

describe('CreateCheckInUseCase', () => {
  it('should throw an error if there is not a registered user with the given user id', () => {
    // Arrange
    const userId = 'any_non_existing_user_id'
    const gymId = 'any_non_existing_gym_id'
    const { sut } = makeSut()

    // Act and Assert
    expect(sut.execute({ userId, gymId })).rejects.toThrowError(
      new InexistentRegisteredUser('id'),
    )
  })

  it('should correctly create a new check in', async () => {
    // Arrange
    const gymId = 'any_gym_id'
    const {
      sut,
      getUserCheckInsHistoryUseCase,
      createUserUseCase,
      authenticateUserUseCase,
    } = makeSut()

    await createUserUseCase.execute({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    })

    const { id: userId } = await authenticateUserUseCase.execute({
      email: 'any_email',
      password: 'any_password',
    })

    const initialCheckInsHistory = await getUserCheckInsHistoryUseCase.execute({
      userId,
    })

    // Act
    await sut.execute({ userId, gymId })

    // Assert
    const checkInsHistory = await getUserCheckInsHistoryUseCase.execute({
      userId,
    })
    expect(initialCheckInsHistory.length).toBe(0)
    expect(checkInsHistory.length).toBe(1)
    const firstCheckIn = checkInsHistory[0]
    expect(firstCheckIn.id).toEqual(expect.any(String))
    expect(firstCheckIn.userId).toBe(userId)
    expect(firstCheckIn.gymId).toEqual(expect.any(String))
    expect(new Date(firstCheckIn.createdAt).getTime()).not.toBeNaN()
  })
})
