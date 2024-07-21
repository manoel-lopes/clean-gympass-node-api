import type { CheckInInputData } from '@/domain/models/check-in'

export type CheckInRepository = {
  save(checkInData: CheckInInputData): Promise<void>
}
