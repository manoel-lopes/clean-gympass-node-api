import type { UseCase } from '@/core/use-case'
import type { UsersRepository } from '@/application/repositories/users-repository'
import type { CheckInsRepository } from '@/application/repositories/check-ins-repository'
import { InexistentRegisteredUser } from '@/application/errors'
import type { CreateCheckInRequest } from './ports'

export class CreateCheckInUseCase implements UseCase {
  constructor(
    private readonly UsersRepository: UsersRepository,
    private readonly CheckInsRepository: CheckInsRepository,
  ) {
    Object.freeze(this)
  }

  async execute(req: CreateCheckInRequest): Promise<void> {
    const { userId, gymId } = req
    const user = await this.UsersRepository.findById(userId)
    if (!user) {
      throw new InexistentRegisteredUser('id')
    }
    await this.CheckInsRepository.save({ userId, gymId })
  }
}
