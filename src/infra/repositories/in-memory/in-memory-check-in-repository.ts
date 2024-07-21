import type { CheckInRepository } from '@/application/repositories/check-in-repository'
import type { CheckIn, CheckInInputData } from '@/domain/models/check-in'

export class InMemoryCheckInRepository implements CheckInRepository {
  private readonly checkIn: CheckIn[] = []
  async save(checkInData: CheckInInputData): Promise<void> {
    this.checkIn.push({
      id: 'any_id',
      createdAt: new Date(),
      ...checkInData,
    })
  }
}
