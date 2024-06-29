import { z } from 'zod'
import { SchemaParseFailedError } from '../errors'

export abstract class SchemaParser {
  static parse<T>(schema: z.Schema, data: unknown): T {
    const parsedSchema = schema.safeParse(data)
    const { error } = parsedSchema
    if (error) {
      const { path, message } = error.errors[0]
      const errorMessage = message.toLowerCase().replace('string must', 'must')
      const field = path[1]
      const formattedErrorMessage = `Field '${field}' ${
        errorMessage === 'required' ? 'is ' + errorMessage : errorMessage
      }`
      throw new SchemaParseFailedError(formattedErrorMessage)
    }
    return parsedSchema.data
  }
}
