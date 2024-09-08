import type { CheckInInputData } from '@/domain/models/check-in/ports/check-in-input-data'
import type { CheckIn } from '@/domain/models/check-in/check-in.model'

export type CheckInsRepository = {
  save(checkInData: CheckInInputData): Promise<void>
  findManyByUserId(userId: string): Promise<CheckIn[]>
  findByUserIdOnDate(userId: string, date?: Date): Promise<CheckIn | null>
}
