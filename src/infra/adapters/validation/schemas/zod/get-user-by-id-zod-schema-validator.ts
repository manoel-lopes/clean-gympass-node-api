import { z } from 'zod'

import type { SchemaValidator } from '@/infra/adapters/validation/schemas/ports'
import type { GetUserByIdRequest } from '@/application/usecases/app/get-user-by-id/ports'
import { SchemaParser } from '@/infra/adapters/validation/helpers/schema-parser'

type GetUserByIdHttpRequest = {
  query: GetUserByIdRequest
}

export class GetUserByIdZodSchemaValidator implements SchemaValidator {
  validate(data: unknown) {
    const schema = z.object({
      query: z.object({
        userId: z.string().cuid(),
      }),
    })
    const validatedData = SchemaParser.parse<GetUserByIdHttpRequest>(
      schema,
      data,
    )
    return validatedData.query
  }
}
