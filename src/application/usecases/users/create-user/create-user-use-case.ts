import type { UseCase } from '@/core/use-case'
import type { UsersRepository } from '@/application/repositories/users-repository'
import type { PasswordHashingProvider } from '@/infra/providers/cryptography/ports'

import type { CreateUserRequest } from './ports'
import { EmailAlreadyBeingUsedError } from './errors'

export class CreateUserUseCase implements UseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHashingProvider: PasswordHashingProvider,
  ) {}

  async execute(req: CreateUserRequest): Promise<void> {
    const { name, email, password } = req
    const hashedPassword = await this.passwordHashingProvider.hash(password)
    const hasUserWithEmail = await this.usersRepository.findByEmail(email)
    if (hasUserWithEmail) {
      throw new EmailAlreadyBeingUsedError(email)
    }
    await this.usersRepository.save({ name, email, password: hashedPassword })
  }
}
