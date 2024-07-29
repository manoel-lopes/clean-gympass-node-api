export class VerifyPasswordError extends Error {
  constructor(message: string) {
    super('Error verifying password: ' + message)
  }
}
