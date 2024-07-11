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
  },
} as UserConfig & {
  test: InlineConfig
})

function resolve(dir: string) {
  return path.join(__dirname, dir)
}
