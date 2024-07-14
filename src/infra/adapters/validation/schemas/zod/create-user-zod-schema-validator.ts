import { z } from 'zod'

import type { SchemaValidator } from '@/infra/adapters/validation/schemas/ports'
import type { CreateUserRequest } from '@/application/usecases/app/create-user/ports'
import { SchemaParser } from '@/infra/adapters/validation/helpers/schema-parser'

type CreateUserHttpRequest = {
  body: CreateUserRequest
}

export class CreateUserZodSchemaValidator implements SchemaValidator {
  validate(data: unknown) {
    const schema = z.object({
      body: z.object({
        name: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(6),
      }),
    })
    const validatedData = SchemaParser.parse<CreateUserHttpRequest>(
      schema,
      data,
    )
    return validatedData.body
  }
}
