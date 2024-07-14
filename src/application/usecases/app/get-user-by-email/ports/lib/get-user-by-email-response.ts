import type { User } from '@/domain/models/user'

export type GetUserByEmailResponse = Omit<User, 'password' | 'createdAt'> & {
  createdAt: string
}
