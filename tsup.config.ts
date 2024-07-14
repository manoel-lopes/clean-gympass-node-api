import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/**/*.ts',
    '!src/core/*.ts',
    '!src/**/*.test.ts',
    '!src/**/ports/*/*.ts',
    '!src/**/ports/*.ts',
    '!src/**/{models,repositories,stub,in-memory}/*.ts',
  ],
  clean: true,
})
