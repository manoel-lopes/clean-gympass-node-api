import { randomUUID } from 'node:crypto'

import { GetCheckInsHistoryUseCase } from '@/application/usecases/check-ins'
import { InexistentRegisteredUser } from '@/application/errors'
import { InMemoryUsersRepository } from '@/infra/repositories/in-memory/in-memory-users-repository'
import { InMemoryCheckInsRepository } from '@/infra/repositories/in-memory/in-memory-check-ins-repository'
import { UserHasAlreadyCheckedInOnTheseDateError } from './errors'
import { CreateCheckInUseCase } from './create-check-in-use-case'

describe('CreateCheckInUseCase', () => {
  let sut: CreateCheckInUseCase
  let getCheckInsHistoryUseCase: GetCheckInsHistoryUseCase
  const userId = randomUUID()
  const gymId = randomUUID()
  beforeEach(async () => {
    const usersRepository = new InMemoryUsersRepository()
    const checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CreateCheckInUseCase(usersRepository, checkInsRepository)
    getCheckInsHistoryUseCase = new GetCheckInsHistoryUseCase(
      usersRepository,
      checkInsRepository,
    )
    await usersRepository.save({
      id: userId,
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    })
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should throw an error if there is not a registered user with the given user id', () => {
    const userId = 'any_non_existing_user_id'
    const gymId = 'any_non_existing_gym_id'

    expect(sut.execute({ userId, gymId })).rejects.toThrowError(
      new InexistentRegisteredUser('id'),
    )
  })

  it('should not be able to check ins twice on same day', async () => {
    await sut.execute({ userId, gymId })

    expect(sut.execute({ userId, gymId })).rejects.toEqual(
      new UserHasAlreadyCheckedInOnTheseDateError(),
    )
  })

  it('should correctly create a new check in', async () => {
    const initialHistory = await getCheckInsHistoryUseCase.execute({ userId })

    await sut.execute({ userId, gymId })

    const checkInsHistory = await getCheckInsHistoryUseCase.execute({ userId })
    const checkIn = checkInsHistory[0]
    expect(initialHistory.length).toBe(0)
    expect(checkInsHistory.length).toBe(1)
    expect(checkIn.id).toEqual(expect.any(String))
    expect(checkIn.userId).toBe(userId)
    expect(checkIn.gymId).toEqual(gymId)
    expect(new Date(checkIn.createdAt).getTime()).not.toBeNaN()
  })

  it('should be able to check on different days', async () => {
    const initialHistory = await getCheckInsHistoryUseCase.execute({ userId })

    vi.setSystemTime(new Date('2024-07-27T08:00:00'))
    await sut.execute({ userId, gymId })

    vi.setSystemTime(new Date('2024-07-28T08:00:00'))
    await sut.execute({ userId, gymId })

    const checkInsHistory = await getCheckInsHistoryUseCase.execute({ userId })
    const checkIn = checkInsHistory[1]
    expect(initialHistory.length).toBe(0)
    expect(checkInsHistory.length).toBe(2)
    expect(checkIn.id).toEqual(expect.any(String))
    expect(checkIn.userId).toBe(userId)
    expect(checkIn.gymId).toEqual(gymId)
    expect(new Date(checkIn.createdAt).getTime()).not.toBeNaN()
  })
})
