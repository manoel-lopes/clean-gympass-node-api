export type User = {
  id?: string
  email: string
  name: string
  password: string
  createdAt?: Date
}

export type UserOutputData = Omit<Required<User>, 'password' | 'createdAt'> & {
  createdAt: string
}
