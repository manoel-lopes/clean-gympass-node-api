import { z } from 'zod'

import type { CreateUserRequest as CreateUserRequestBody } from '@/domain/usecases/create-user'
import type { CreateUserSchemaValidator } from '@/application/validation/schema/create-user-schema-validator'
import { SchemaParser } from '../helpers/schema-parser'

type CreateUserRequest = {
  body: CreateUserRequestBody
}

export class CreateUserZodSchemaValidator implements CreateUserSchemaValidator {
  validate(data: unknown): CreateUserRequestBody {
    const schema = z.object({
      body: z.object({
        name: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(6),
      }),
    })
    const validatedData = SchemaParser.parse<CreateUserRequest>(schema, data)
    return validatedData.body
  }
}
