import type { UserRepository } from '@/application/repositories/user-repository'
import type { User } from '@/domain/models/user'
import { prisma } from '@/infra/db/client'

export class PrismaUserRepository implements UserRepository {
  async save(userData: User): Promise<void> {
    const { name, email, password } = userData
    await prisma.user.create({ data: { name, email, password } })
  }

  async findByEmail(email: string): Promise<Required<User> | null> {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return null
    const { created_at, ...rest } = user
    return { ...rest, createdAt: created_at }
  }
}
