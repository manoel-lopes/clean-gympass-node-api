import type { UseCase } from '@/core/use-case'
import type { UsersRepository } from '@/application/repositories/users-repository'
import { InexistentRegisteredUser } from '@/application/errors'
import type { GetUserByEmailRequest, GetUserByEmailResponse } from './ports'

export class GetUserByEmailUseCase implements UseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    email,
  }: GetUserByEmailRequest): Promise<GetUserByEmailResponse> {
    const user = await this.usersRepository.findByEmail(email)
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
