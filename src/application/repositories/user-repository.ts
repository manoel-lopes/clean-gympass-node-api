import type { User, UserInputData } from '@/domain/models/user'

export type UserRepository = {
  save(userData: UserInputData): Promise<void>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
}
