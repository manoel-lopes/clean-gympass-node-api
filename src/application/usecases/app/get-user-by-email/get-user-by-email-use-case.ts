import type { User } from '@/domain/models/user'
import type { GetUserByEmail } from '@/domain/usecases/get-user-by-email'
import type { UserRepository } from '@/application/repositories/user-repository'
import { InexistentRegisteredUserWithGivenEmailError } from './errors'

export class GetUserByEmailUseCase implements GetUserByEmail {
  constructor(private readonly userRepository: UserRepository) {
    Object.freeze(this)
  }

  async execute(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new InexistentRegisteredUserWithGivenEmailError(email)
    }
    return user
  }
}
