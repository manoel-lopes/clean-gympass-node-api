import type { UseCase } from '@/core/use-case'
import type { UserRepository } from '@/application/repositories/user-repository'
import { InexistentRegisteredUser } from '@/application/errors'
import type { GetUserByIdRequest, GetUserByIdResponse } from './ports'

export class GetUserByIdUseCase implements UseCase {
  constructor(private readonly userRepository: UserRepository) {
    Object.freeze(this)
  }

  async execute(req: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    const user = await this.userRepository.findById(req.userId)
    if (!user) {
      throw new InexistentRegisteredUser('id')
    }
    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    }
    return formattedUser
  }
}
