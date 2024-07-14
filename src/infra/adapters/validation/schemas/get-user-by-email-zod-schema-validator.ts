import { z } from 'zod'

import type { SchemaValidator } from './ports'
import type { GetUserByEmailRequest } from '@/application/usecases/app/get-user-by-email/ports'
import { SchemaParser } from '../helpers/schema-parser'

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
