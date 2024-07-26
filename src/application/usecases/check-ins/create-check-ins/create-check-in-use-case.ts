import type { UseCase } from '@/core/use-case'
import type { UsersRepository } from '@/application/repositories/users-repository'
import type { CheckInRepository } from '@/application/repositories/check-in-repository'
import { InexistentRegisteredUser } from '@/application/errors'
import type { CreateCheckInRequest } from './ports'

export class CreateCheckInUseCase implements UseCase {
  constructor(
    private readonly UsersRepository: UsersRepository,
    private readonly checkInRepository: CheckInRepository,
  ) {
    Object.freeze(this)
  }

  async execute(req: CreateCheckInRequest): Promise<void> {
    const { userId, gymId } = req
    const user = await this.UsersRepository.findById(userId)
    if (!user) {
      throw new InexistentRegisteredUser('id')
    }
    await this.checkInRepository.save({ userId, gymId })
  }
}
