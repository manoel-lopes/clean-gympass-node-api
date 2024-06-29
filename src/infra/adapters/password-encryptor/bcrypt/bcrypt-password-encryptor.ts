import bcrypt from 'bcrypt'
import type { PasswordEncryptor } from '../ports'

export class BcryptPasswordEncryptor implements PasswordEncryptor {
  constructor(private readonly salt = 6) {
    Object.freeze(this)
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.salt)
  }

  verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }
}
