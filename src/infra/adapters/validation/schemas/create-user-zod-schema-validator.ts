import { z } from 'zod'

import type { CreateUserSchemaValidator } from '@/application/validation/schema/create-user-schema-validator'
import type { User } from '@/domain/models/user'
import { SchemaParser } from '../helpers/schema-parser'

export class CreateUserZodSchemaValidator implements CreateUserSchemaValidator {
  validate(data: unknown): User {
    const schema = z.object({
      body: z.object({
        name: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(6),
      }),
    })
    const validatedData = SchemaParser.parse<User>(schema, data)
    return validatedData
  }
}
