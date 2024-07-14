import { z } from 'zod'

import type { SchemaValidator } from '@/infra/adapters/validation/schemas/ports'
import type { AuthenticateUserRequest } from '@/application/usecases/auth/authenticate-user/ports'
import { SchemaParser } from '@/infra/adapters/validation/helpers/schema-parser'

type AuthenticateUserHttpRequest = {
  body: AuthenticateUserRequest
}

export class AuthenticateUserZodSchemaValidator implements SchemaValidator {
  validate(data: unknown) {
    const schema = z.object({
      body: z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
    })
    const validatedData = SchemaParser.parse<AuthenticateUserHttpRequest>(
      schema,
      data,
    )
    return validatedData.body
  }
}
