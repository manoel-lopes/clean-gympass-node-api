import { randomUUID } from 'node:crypto'

import type { CheckInRepository } from '@/application/repositories/check-in-repository'
import type { CheckIn, CheckInInputData } from '@/domain/models/check-in'

export class InMemoryCheckInRepository implements CheckInRepository {
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
