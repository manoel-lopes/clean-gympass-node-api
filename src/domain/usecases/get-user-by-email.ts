import type { UseCase } from '@/core/use-case'
import type { User } from '../models/user'

export type GetUserByEmail = UseCase<string, User>
