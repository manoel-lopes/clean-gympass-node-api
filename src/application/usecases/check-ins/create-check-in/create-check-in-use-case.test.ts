import { InMemoryUsersRepository } from '@/infra/repositories/in-memory/in-memory-users-repository'
import { InMemoryCheckInsRepository } from '@/infra/repositories/in-memory/in-memory-check-ins-repository'
import { PasswordEncryptorStub } from '@/infra/adapters/password-encryptor/stub/password-encryptor-stub'
import { InexistentRegisteredUser } from '@/application/errors'
import {
  CreateUserUseCase,
  AuthenticateUserUseCase,
} from '@/application/usecases/users'
import { GetCheckInsHistoryUseCase } from '@/application/usecases/check-ins'
import { UserHasAlreadyCheckedInOnTheseDateError } from './errors'
import { CreateCheckInUseCase } from './create-check-in-use-case'

type Sut = {
  sut: CreateCheckInUseCase
  getCheckInsHistoryUseCase: GetCheckInsHistoryUseCase
  createUserUseCase: CreateUserUseCase
  authenticateUserUseCase: AuthenticateUserUseCase
}

function makeSut(): Sut {
  const usersRepository = new InMemoryUsersRepository()
  const checkInsRepository = new InMemoryCheckInsRepository()
  const passwordEncryptor = new PasswordEncryptorStub()
  const sut = new CreateCheckInUseCase(usersRepository, checkInsRepository)
  const createUserUseCase = new CreateUserUseCase(
    usersRepository,
    passwordEncryptor,
  )
  const authenticateUserUseCase = new AuthenticateUserUseCase(
    usersRepository,
    passwordEncryptor,
  )
  const getCheckInsHistoryUseCase = new GetCheckInsHistoryUseCase(
    usersRepository,
    checkInsRepository,
  )
  return {
    sut,
    getCheckInsHistoryUseCase,
    createUserUseCase,
    authenticateUserUseCase,
  }
}

describe('CreateCheckInUseCase', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

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

  it('should not be able to check ins twice on same day', async () => {
    // Arrange
    const gymId = 'any_gym_id'
    const { sut, createUserUseCase, authenticateUserUseCase } = makeSut()

    await createUserUseCase.execute({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    })

    const { id: userId } = await authenticateUserUseCase.execute({
      email: 'any_email',
      password: 'any_password',
    })

    // Act
    await sut.execute({ userId, gymId })

    expect(sut.execute({ userId, gymId })).rejects.toEqual(
      new UserHasAlreadyCheckedInOnTheseDateError(),
    )
  })

  it('should correctly create a new check in', async () => {
    // Arrange
    const gymId = 'any_gym_id'
    const {
      sut,
      getCheckInsHistoryUseCase,
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

    const initialCheckInsHistory = await getCheckInsHistoryUseCase.execute({
      userId,
    })

    // Act
    await sut.execute({ userId, gymId })

    // Assert
    const checkInsHistory = await getCheckInsHistoryUseCase.execute({
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

  it('should be able to check on different days', async () => {
    // Arrange
    const gymId = 'any_gym_id'
    const {
      sut,
      getCheckInsHistoryUseCase,
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

    const initialCheckInsHistory = await getCheckInsHistoryUseCase.execute({
      userId,
    })

    vi.setSystemTime(new Date('2024-07-27T08:00:00'))
    await sut.execute({ userId, gymId })

    // Act
    vi.setSystemTime(new Date('2024-07-28T08:00:00'))
    await sut.execute({ userId, gymId })

    // Assert
    const checkInsHistory = await getCheckInsHistoryUseCase.execute({
      userId,
    })
    expect(initialCheckInsHistory.length).toBe(0)
    expect(checkInsHistory.length).toBe(2)
    const secondCheckIn = checkInsHistory[1]
    expect(secondCheckIn.id).toEqual(expect.any(String))
    expect(secondCheckIn.userId).toBe(userId)
    expect(secondCheckIn.gymId).toEqual(expect.any(String))
    expect(new Date(secondCheckIn.createdAt).getTime()).not.toBeNaN()
  })
})
