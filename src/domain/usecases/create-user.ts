import type { UseCase } from '@/core/use-case'
import type { User } from '@/domain/models/user'

export type CreateUser = UseCase<User>
