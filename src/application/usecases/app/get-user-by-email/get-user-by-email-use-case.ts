import type {
  GetUserByEmail,
  GetUserByEmailResponse,
} from '@/domain/usecases/get-user-by-email'
import type { UserRepository } from '@/application/repositories/user-repository'
import { InexistentRegisteredUserWithGivenEmailError } from './errors'

export class GetUserByEmailUseCase implements GetUserByEmail {
  constructor(private readonly userRepository: UserRepository) {
    Object.freeze(this)
  }

  async execute(email: string): Promise<GetUserByEmailResponse> {
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
