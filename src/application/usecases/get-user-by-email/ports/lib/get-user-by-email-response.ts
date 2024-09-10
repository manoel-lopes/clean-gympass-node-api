import type { User } from '@/domain/models/user/user.model'

export type GetUserByEmailResponse = Omit<User, 'password' | 'createdAt'> & {
  createdAt: string
}
