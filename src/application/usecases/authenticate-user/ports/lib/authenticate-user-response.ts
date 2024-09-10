import type { User } from '@/domain/models/user/user.model'

export type AuthenticateUserResponse = Omit<User, 'password' | 'createdAt'> & {
  createdAt: string
}
