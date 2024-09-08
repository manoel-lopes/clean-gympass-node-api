export class EmailAlreadyBeingUsedError extends Error {
  constructor(email: string) {
    super(`The email '${email}' is already being used`)
  }
}
