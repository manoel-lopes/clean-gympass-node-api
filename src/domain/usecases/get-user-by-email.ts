import type { UseCase } from '@/core/use-case'
import type { User } from '../models/user'

export type GetUserByEmailResponse = Omit<User, 'password' | 'createdAt'> & {
  createdAt: string
}

export type GetUserByEmail = UseCase<string, GetUserByEmailResponse>
