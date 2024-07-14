import { z } from 'zod'

import type { GetUserByEmailSchemaValidator } from '@/application/validation/schema/get-user-by-email-schema-validator'
import type { GetUserByEmailRequest } from '@/application/usecases/app/get-user-by-email/ports'
import { SchemaParser } from '../helpers/schema-parser'

type GetUserByEmailHttpRequest = {
  params: GetUserByEmailRequest
}

export class GetUserByEmailZodSchemaValidator
  implements GetUserByEmailSchemaValidator
{
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
