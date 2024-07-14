import type { UseCase } from '@/core/use-case'
import type { UserRepository } from '@/application/repositories/user-repository'
import type { GetUserByEmailRequest, GetUserByEmailResponse } from './ports'
import { InexistentRegisteredUserWithGivenEmailError } from './errors'

export class GetUserByEmailUseCase implements UseCase {
  constructor(private readonly userRepository: UserRepository) {
    Object.freeze(this)
  }

  async execute({
    email,
  }: GetUserByEmailRequest): Promise<GetUserByEmailResponse> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new InexistentRegisteredUserWithGivenEmailError(email)
    }
    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: new Date(user.createdAt).toISOString(),
    }
    return formattedUser
  }
}
