export class HashingPasswordError extends Error {
  constructor(message: string) {
    super('Error hashing password: ' + message)
  }
}
