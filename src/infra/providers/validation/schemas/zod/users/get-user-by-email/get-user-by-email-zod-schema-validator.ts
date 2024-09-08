import { z } from 'zod'

import type { SchemaValidator } from '@/infra/adapters/validation/schemas/ports'
import type { GetUserByEmailRequest } from '@/application/usecases/users/get-user-by-email/ports'
import { SchemaParser } from '@/infra/adapters/validation/helpers/schema-parser'

type GetUserByEmailHttpRequest = {
  params: GetUserByEmailRequest
}

export class GetUserByEmailZodSchemaValidator implements SchemaValidator {
  validate(data: unknown) {
    const schema = z.object({
      params: z.object({
        email: z.string().email(),
      }),
    })
    const validatedData = SchemaParser.parse<GetUserByEmailHttpRequest>(
      schema,
      data,
    )
    return validatedData.params
  }
}
