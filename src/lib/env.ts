import { z } from 'zod'

const _env = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    PORT: z
      .string()
      .default('3000')
      .transform((port) => Number(port)),
  })
  .safeParse(process.env)

if (!_env.success) {
  console.error(
    `\n\x1b[1m\x1b[31m❌ Invalid environment variables:', _env.error.format()\x1b[0m\n`,
    _env.error.format(),
  )
  process.exit(1)
}

export const env = _env.data
