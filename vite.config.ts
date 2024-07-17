import path from 'node:path'
import { defineConfig, configDefaults } from 'vitest/config'
import type { InlineConfig } from 'vitest'
import type { UserConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@/': resolve('./src/'),
    },
  },
  test: {
    globals: true,
    exclude: [...configDefaults.exclude, 'src/main'],
    coverage: {
      include: ['src/'],
      exclude: [
        ...configDefaults.exclude,
        'src/main',
        'src/core',
        'src/lib',
        'src/infra/api',
        'src/infra/db',
        'src/infra/adapters/validation/schemas/zod',
        'src/infra/adapters/password-encryptor/bcrypt',
        'src/infra/adapters/validation/errors',
        'src/infra/adapters/http/http-server/fasitfy',
        'src/infra/repositories/prisma',
        'src/**/index.ts',
        'src/**/helpers/*.ts',
      ],
    },
  },
} as UserConfig & {
  test: InlineConfig
})

function resolve(dir: string) {
  return path.join(__dirname, dir)
}
