import type { UseCase } from '@/core/use-case'
import type { CheckIn } from '@/domain/models/check-in'
import type { UsersRepository } from '@/application/repositories/users-repository'
import type { CheckInsRepository } from '@/application/repositories/check-ins-repository'
import { InexistentRegisteredUser } from '@/application/errors'
import type { GetCheckInsHistoryRequest } from './ports'

export class GetCheckInsHistoryUseCase implements UseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly checkInsRepository: CheckInsRepository,
  ) {}

  async execute(req: GetCheckInsHistoryRequest): Promise<CheckIn[]> {
    const { userId } = req
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new InexistentRegisteredUser('id')
    }
    const checkIns = await this.checkInsRepository.findManyByUserId(userId)
    return checkIns
  }
}
