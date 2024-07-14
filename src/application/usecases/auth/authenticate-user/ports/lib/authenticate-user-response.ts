import type { User } from '@/domain/models/user'

export type AuthenticateUserResponse = Omit<User, 'password' | 'createdAt'> & {
  createdAt: string
}
