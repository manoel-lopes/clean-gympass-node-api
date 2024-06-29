import type { User } from '@/domain/models/user'

export type UserRepository = {
  save(userData: User): Promise<void>
  findByEmail(email: string): Promise<User | null>
}
