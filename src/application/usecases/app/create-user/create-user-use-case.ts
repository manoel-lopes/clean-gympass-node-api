import type { User } from '@/domain/models/user'
import type { CreateUser } from '@/domain/usecases/create-user'
import type { UserRepository } from '@/application/repositories/user-repository'
import type { PasswordEncryptor } from '@/infra/adapters/password-encryptor/ports'
import { EmailAlreadyBeingUsedError } from './errors'

export class CreateUserUseCase implements CreateUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordEncryptor: PasswordEncryptor,
  ) {
    Object.freeze(this)
  }

  async execute(input: User): Promise<void> {
    const { name, email, password } = input
    const hashedPassword = await this.passwordEncryptor.hashPassword(password)
    const hasUserWithEmail = await this.userRepository.findByEmail(email)
    if (hasUserWithEmail) {
      throw new EmailAlreadyBeingUsedError(email)
    }
    await this.userRepository.save({ name, email, password: hashedPassword })
  }
}
