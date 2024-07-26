import type { UseCase } from '@/core/use-case'
import type { UsersRepository } from '@/application/repositories/users-repository'
import { InexistentRegisteredUser } from '@/application/errors'
import type { GetUserByIdRequest, GetUserByIdResponse } from './ports'

export class GetUserByIdUseCase implements UseCase {
  constructor(private readonly UsersRepository: UsersRepository) {
    Object.freeze(this)
  }

  async execute(req: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    const user = await this.UsersRepository.findById(req.userId)
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
