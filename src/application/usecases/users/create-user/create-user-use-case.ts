import type { UseCase } from '@/core/use-case'
import type { UsersRepository } from '@/application/repositories/users-repository'
import type { PasswordEncryptor } from '@/infra/adapters/password-encryptor/ports'
import type { CreateUserRequest } from './ports'
import { EmailAlreadyBeingUsedError } from './errors'

export class CreateUserUseCase implements UseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordEncryptor: PasswordEncryptor,
  ) {
    Object.freeze(this)
  }

  async execute(req: CreateUserRequest): Promise<void> {
    const { name, email, password } = req
    const hashedPassword = await this.passwordEncryptor.hashPassword(password)
    const hasUserWithEmail = await this.usersRepository.findByEmail(email)
    if (hasUserWithEmail) {
      throw new EmailAlreadyBeingUsedError(email)
    }
    await this.usersRepository.save({ name, email, password: hashedPassword })
  }
}
