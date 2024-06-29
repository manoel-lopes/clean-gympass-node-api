import path from 'node:path'
import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@/': resolve('./src/'),
    },
  },
  test: {
    exclude: [...configDefaults.exclude, 'src/main'],
  },
})

function resolve(dir: string) {
  return path.join(__dirname, dir)
}
