import { prisma } from '@/infra/db/client'
import type { UsersRepository } from '@/application/repositories/users.repository'
import type { UserInputData } from '@/domain/models/user/ports/user-input'
import type { User } from '@/domain/models/user/user.model'

export class PrismaUsersRepository implements UsersRepository {
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
