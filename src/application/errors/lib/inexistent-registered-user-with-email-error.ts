export class InexistentRegisteredUserWithEmailError extends Error {
  constructor(email: string) {
    super(`There's no registered user with email '${email}'`)
    this.name = 'InexistentRegisteredUserWithEmailError'
  }
}
