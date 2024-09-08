import type { User } from '../user.model'

export type UserInputData = Omit<User, 'id' | 'createdAt'>
