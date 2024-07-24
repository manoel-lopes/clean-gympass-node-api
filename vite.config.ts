import path from 'path'
import { defineConfig, configDefaults, UserConfig } from 'vitest/config'
import type { InlineConfig } from 'vitest'

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
