import bcrypt from 'bcrypt'

import type { PasswordEncryptor } from '../ports'
import { HashingPasswordError, VerifyPasswordError } from '../errors'

export class BcryptPasswordEncryptor implements PasswordEncryptor {
  constructor(private readonly salt = 6) {}

  async hashPassword(password: string) {
    try {
      return bcrypt.hash(password, this.salt)
    } catch (error) {
      throw new HashingPasswordError(error.message)
    }
  }

  async verifyPassword(password: string, hashedPassword: string) {
    try {
      return bcrypt.compare(password, hashedPassword)
    } catch (error) {
      throw new VerifyPasswordError(error.message)
    }
  }
}
