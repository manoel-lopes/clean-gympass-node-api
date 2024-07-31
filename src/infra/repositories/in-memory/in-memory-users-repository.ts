import crypto from 'node:crypto'

import type { UsersRepository } from '@/application/repositories/users-repository'
import type { User, UserInputData } from '@/domain/models/user'

type UserData = UserInputData & { id?: string }

export class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = []

  async save(userData: UserData): Promise<void> {
    const { id, name, email, password } = userData
    this.users.push({
      id: id || crypto.randomUUID(),
      name,
      email,
      password,
      createdAt: new Date(),
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null
  }
}
