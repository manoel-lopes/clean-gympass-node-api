import type { UserInputData } from '@/domain/models/user/ports/user-input'
import type { User } from '@/domain/models/user/user.model'

export type UsersRepository = {
  save(userData: UserInputData): Promise<void>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
}
