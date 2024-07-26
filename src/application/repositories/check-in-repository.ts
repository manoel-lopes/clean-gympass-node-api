import type { CheckInInputData, CheckIn } from '@/domain/models/check-in'

export type CheckInRepository = {
  save(checkInData: CheckInInputData): Promise<void>
  findManyByUserId(userId: string): Promise<CheckIn[]>
}
