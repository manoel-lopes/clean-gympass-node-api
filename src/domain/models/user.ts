export type User = {
  id: string
  email: string
  name: string
  password: string
  createdAt: Date
}

export type UserInputData = Omit<User, 'id' | 'createdAt'>
