import { z } from 'zod'

import type {
  GetUserByEmailRequestParams,
  GetUserByEmailSchemaValidator,
} from '@/application/validation/schema/get-user-by-email-schema-validator'
import { SchemaParser } from '../helpers/schema-parser'

type GetUserByEmailRequest = {
  params: GetUserByEmailRequestParams
}

export class ZodSchemaValidator implements GetUserByEmailSchemaValidator {
  validate(data: unknown) {
    const schema = z.object({
      params: z.object({
        email: z.string().email(),
      }),
    })
    const validatedData = SchemaParser.parse<GetUserByEmailRequest>(
      schema,
      data,
    )
    return validatedData.params
  }
}
