import type { UseCase } from '@/core/use-case'
import type { UsersRepository } from '@/application/repositories/users-repository'
import type { CheckInsRepository } from '@/application/repositories/check-ins-repository'
import { InexistentRegisteredUser } from '@/application/errors'
import type { CreateCheckInRequest } from './ports'
import { UserHasAlreadyCheckedInOnTheseDateError } from './errors'

export class CreateCheckInUseCase implements UseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly checkInsRepository: CheckInsRepository,
  ) {}

  async execute(req: CreateCheckInRequest): Promise<void> {
    const { userId, gymId } = req
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new InexistentRegisteredUser('id')
    }
    const hasCheckInOnSameDay =
      await this.checkInsRepository.findByUserIdOnDate(userId)
    if (hasCheckInOnSameDay) {
      throw new UserHasAlreadyCheckedInOnTheseDateError()
    }
    await this.checkInsRepository.save({ userId, gymId })
  }
}
