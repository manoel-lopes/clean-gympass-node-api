import type { User } from '@/domain/models/user/user.model'

export type GetUserByIdResponse = Omit<User, 'password' | 'createdAt'> & {
  createdAt: string
}
