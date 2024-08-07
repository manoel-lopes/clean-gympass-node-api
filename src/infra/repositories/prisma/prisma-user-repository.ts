import type { UserRepository } from '@/application/repositories/user-repository'
import type { User, UserInputData } from '@/domain/models/user'
import { prisma } from '@/infra/db/client'

export class PrismaUserRepository implements UserRepository {
  async save(userData: UserInputData): Promise<void> {
    const { name, email, password } = userData
    await prisma.user.create({ data: { name, email, password } })
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return null
    const { created_at, ...rest } = user
    return { ...rest, createdAt: created_at }
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return null
    const { created_at, ...rest } = user
    return { ...rest, createdAt: created_at }
  }
}
