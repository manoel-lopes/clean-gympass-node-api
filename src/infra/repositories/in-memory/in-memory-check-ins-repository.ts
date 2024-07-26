import { randomUUID } from 'node:crypto'

import type { CheckInsRepository } from '@/application/repositories/check-ins-repository'
import type { CheckIn, CheckInInputData } from '@/domain/models/check-in'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  private readonly checkIns: CheckIn[] = []
  async save(checkInData: CheckInInputData): Promise<void> {
    this.checkIns.push({
      id: randomUUID(),
      createdAt: new Date(),
      ...checkInData,
    })
  }

  async findManyByUserId(userId: string): Promise<CheckIn[]> {
    return this.checkIns.filter((checkIn) => checkIn.userId === userId)
  }
}
