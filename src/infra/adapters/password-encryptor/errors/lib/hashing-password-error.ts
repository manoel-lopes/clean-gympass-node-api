export class HashingPasswordError extends Error {
  constructor(message: string) {
    super(message)
    this.name = `Error hashing password: ${message}`
  }
}
