import type { UseCase } from '@/core/use-case'
import type { CheckIn } from '@/domain/models/check-in'
import type { UserRepository } from '@/application/repositories/user-repository'
import type { CheckInRepository } from '@/application/repositories/check-in-repository'
import { InexistentRegisteredUser } from '@/application/errors'
import type { GetUserCheckInsHistoryRequest } from './ports'

export class GetUserCheckInsHistoryUseCase implements UseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly checkInRepository: CheckInRepository,
  ) {
    Object.freeze(this)
  }

  async execute(req: GetUserCheckInsHistoryRequest): Promise<CheckIn[]> {
    const { userId } = req
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new InexistentRegisteredUser('id')
    }
    const checkIns = await this.checkInRepository.findManyByUserId(userId)
    return checkIns
  }
}
