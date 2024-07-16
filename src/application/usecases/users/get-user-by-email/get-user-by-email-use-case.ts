import type { UseCase } from '@/core/use-case'
import type { UserRepository } from '@/application/repositories/user-repository'
import { InexistentRegisteredUser } from '@/application/errors'
import type { GetUserByEmailRequest, GetUserByEmailResponse } from './ports'

export class GetUserByEmailUseCase implements UseCase {
  constructor(private readonly userRepository: UserRepository) {
    Object.freeze(this)
  }

  async execute({
    email,
  }: GetUserByEmailRequest): Promise<GetUserByEmailResponse> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new InexistentRegisteredUser('email')
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
