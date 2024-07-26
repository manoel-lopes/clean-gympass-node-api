import type { UseCase } from '@/core/use-case'
import type { CheckIn } from '@/domain/models/check-in'
import type { UsersRepository } from '@/application/repositories/users-repository'
import type { CheckInsRepository } from '@/application/repositories/check-ins-repository'
import { InexistentRegisteredUser } from '@/application/errors'
import type { GetUserCheckInsHistoryRequest } from './ports'

export class GetUserCheckInsHistoryUseCase implements UseCase {
  constructor(
    private readonly UsersRepository: UsersRepository,
    private readonly CheckInsRepository: CheckInsRepository,
  ) {
    Object.freeze(this)
  }

  async execute(req: GetUserCheckInsHistoryRequest): Promise<CheckIn[]> {
    const { userId } = req
    const user = await this.UsersRepository.findById(userId)
    if (!user) {
      throw new InexistentRegisteredUser('id')
    }
    const checkIns = await this.CheckInsRepository.findManyByUserId(userId)
    return checkIns
  }
}
