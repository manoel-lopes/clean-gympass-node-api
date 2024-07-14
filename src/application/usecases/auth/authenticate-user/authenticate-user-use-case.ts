import type { UseCase } from '@/core/use-case'
import type { UserRepository } from '@/application/repositories/user-repository'
import type { PasswordEncryptor } from '@/infra/adapters/password-encryptor/ports/lib/password-encryptor'
import { InexistentRegisteredUserWithEmailError } from '@/application/errors'
import type { AuthenticateUserRequest, AuthenticateUserResponse } from './ports'
import { InvalidPasswordError } from './errors'

export class AuthenticateUserUseCase implements UseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordEncryptor: PasswordEncryptor,
  ) {
    Object.freeze(this)
  }

  async execute(
    req: AuthenticateUserRequest,
  ): Promise<AuthenticateUserResponse> {
    const { email, password } = req
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new InexistentRegisteredUserWithEmailError(email)
    }
    const doesPasswordMatch = await this.passwordEncryptor.verifyPassword(
      password,
      user.password,
    )
    if (!doesPasswordMatch) {
      throw new InvalidPasswordError()
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
