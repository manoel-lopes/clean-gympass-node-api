import type { User } from '@/domain/models/user'

export type GetUserByIdResponse = Omit<User, 'password' | 'createdAt'> & {
  createdAt: string
}
