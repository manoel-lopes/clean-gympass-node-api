export class VerifyPasswordError extends Error {
  constructor(message: string) {
    super(message)
    this.name = `Error verifying password: ${message}`
  }
}
