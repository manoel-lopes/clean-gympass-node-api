import type { UserRepository } from '@/application/repositories/user-repository'
import type { User } from '@/domain/models/user'
import { prisma } from '@/infra/db/client'

export class PrismaUserRepository implements UserRepository {
  async save(userData: User): Promise<void> {
    await prisma.user.create({ data: userData })
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return null
    // eslint-disable-next-line camelcase
    const { create_at, ...rest } = user
    // eslint-disable-next-line camelcase
    return { ...rest, createAt: create_at }
  }
}
