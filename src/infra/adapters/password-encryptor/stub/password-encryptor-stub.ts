import type { PasswordEncryptor } from '../ports'

export class PasswordEncryptorStub implements PasswordEncryptor {
  async hashPassword(): Promise<string> {
    return 'hashed_password'
  }

  async verifyPassword(): Promise<boolean> {
    return true
  }
}
