type Resource = 'email' | 'id'

export class InexistentRegisteredUser extends Error {
  constructor(type: Resource) {
    super(`There's no registered user with these ${type}`)
    this.name = 'InexistentRegisteredUser'
  }
}
