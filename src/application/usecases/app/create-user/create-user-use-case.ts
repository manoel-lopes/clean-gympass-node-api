import type { UseCase } from '@/core/use-case'
import type { UserRepository } from '@/application/repositories/user-repository'
import type { PasswordEncryptor } from '@/infra/adapters/password-encryptor/ports'
import { EmailAlreadyBeingUsedError } from './errors'
import type { CreateUserRequest } from './ports'

export class CreateUserUseCase implements UseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordEncryptor: PasswordEncryptor,
  ) {
    Object.freeze(this)
  }

  async execute(req: CreateUserRequest): Promise<void> {
    const { name, email, password } = req
    const hashedPassword = await this.passwordEncryptor.hashPassword(password)
    const hasUserWithEmail = await this.userRepository.findByEmail(email)
    if (hasUserWithEmail) {
      throw new EmailAlreadyBeingUsedError(email)
    }
    await this.userRepository.save({ name, email, password: hashedPassword })
  }
}
