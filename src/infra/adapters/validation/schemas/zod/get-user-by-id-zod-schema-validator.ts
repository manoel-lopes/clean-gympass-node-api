import { z } from 'zod'

import type { SchemaValidator } from '@/infra/adapters/validation/schemas/ports'
import type { GetUserByIdRequest } from '@/application/usecases/app/get-user-by-id/ports'
import { SchemaParser } from '@/infra/adapters/validation/helpers/schema-parser'

type GetUserByIdHttpRequest = {
  params: GetUserByIdRequest
}

export class GetUserByIdZodSchemaValidator implements SchemaValidator {
  validate(data: unknown) {
    const schema = z.object({
      params: z.object({
        userId: z.string().cuid('Invalid user id'),
      }),
    })
    const validatedData = SchemaParser.parse<GetUserByIdHttpRequest>(
      schema,
      data,
    )
    return validatedData.params
  }
}
