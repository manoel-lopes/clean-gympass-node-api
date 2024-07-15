import { z } from 'zod'

const _env = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .default('3000')
    .transform((port) => Number(port)),
})

const parsedEnv = _env.safeParse(process.env)
if (!parsedEnv.success) {
  console.error(
    `\n\x1b[1m\x1b[31m❌ Invalid environment variables:', parsedEnv.error.format()\x1b[0m\n`,
    parsedEnv.error.format(),
  )
  process.exit(1)
}

export const env = parsedEnv.data

export type Env = z.infer<typeof _env>
