import crypto from 'node:crypto'

import type { UserRepository } from '@/application/repositories/user-repository'
import type { User } from '@/domain/models/user'

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = []

  async save(userData: User): Promise<void> {
    this.users.push({
      id: crypto.randomUUID(),
      createdAt: new Date().toString(),
      ...userData,
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null
  }
}
