import type { UseCase } from '@/core/use-case'
import type { User } from '@/domain/models/user'

export type CreateUserRequest = Omit<User, 'id' | 'createdAt'>

export type CreateUser = UseCase<CreateUserRequest, void>
