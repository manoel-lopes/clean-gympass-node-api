import { z } from 'zod'

import type {
  GetUserByEmailRequestParams,
  GetUserByEmailSchemaValidator,
} from '@/application/validation/schema/get-user-by-email-schema-validator'
import { SchemaParser } from '../helpers/schema-parser'

type GetUserByEmailHttpRequest = {
  params: GetUserByEmailRequestParams
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
