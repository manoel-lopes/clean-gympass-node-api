import type { User } from '@/domain/models/user'

export type CreateUserRequest = Omit<User, 'id' | 'createdAt'>
