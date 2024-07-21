export type CheckIn = {
  id: string
  createdAt: Date
  validatedDate?: Date
  userId: string
  gymId: string
}

export type CheckInInputData = Pick<CheckIn, 'userId' | 'gymId'>
