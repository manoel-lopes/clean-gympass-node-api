export type PasswordEncryptor = {
  hashPassword(password: string): Promise<string>
  verifyPassword(password: string, hashedPassword: string): Promise<boolean>
}
