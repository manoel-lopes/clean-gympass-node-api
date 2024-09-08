import bcrypt from 'bcrypt'

import type { PasswordHashingProvider } from '@/infra/providers/cryptography/ports'
import {
  HashingPasswordError,
  VerifyPasswordError,
} from '@/infra/providers/cryptography/errors'

export class BcryptProvider implements PasswordHashingProvider {
  private readonly SALT = 6

  async hash(password: string) {
    try {
      return bcrypt.hash(password, this.SALT)
    } catch (error) {
      throw new HashingPasswordError(error.message)
    }
  }

  async compare(password: string, hashedPassword: string) {
    try {
      return bcrypt.compare(password, hashedPassword)
    } catch (error) {
      throw new VerifyPasswordError(error.message)
    }
  }
}
