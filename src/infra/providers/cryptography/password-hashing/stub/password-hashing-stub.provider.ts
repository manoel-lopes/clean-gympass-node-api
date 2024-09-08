import type { PasswordHashingProvider } from '@/infra/providers/cryptography/ports'

export class PasswordHashingStubProvider implements PasswordHashingProvider {
  async hash(): Promise<string> {
    return 'hashed_password'
  }

  async compare(): Promise<boolean> {
    return true
  }
}
