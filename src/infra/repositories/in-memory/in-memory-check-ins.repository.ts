import { randomUUID } from 'node:crypto'

import type { CheckInsRepository } from '@/application/repositories/check-ins-repository'
import type { CheckIn, CheckInInputData } from '@/domain/models/check-in'
import { convertDateToString } from '@/infra/helpers/convert-date-to-string'

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

  async findByUserIdOnDate(
    userId: string,
    date = new Date(),
  ): Promise<CheckIn | null> {
    const checkIn = this.checkIns.find(
      (checkIn) =>
        checkIn.userId === userId &&
        convertDateToString(checkIn.createdAt) === convertDateToString(date),
    )
    return checkIn || null
  }
}
