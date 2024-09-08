import type { CheckIn } from '../check-in.model'

export type CheckInInputData = Pick<CheckIn, 'userId' | 'gymId'>
