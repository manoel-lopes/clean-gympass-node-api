import crypto from 'node:crypto'

import type { UserRepository } from '@/application/repositories/user-repository'
import type { User, UserInputData } from '@/domain/models/user'

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = []

  async save(userData: UserInputData): Promise<void> {
    this.users.push({
      ...userData,
      id: crypto.randomUUID(),
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
