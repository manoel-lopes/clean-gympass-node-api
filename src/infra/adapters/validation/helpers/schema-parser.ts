import { z } from 'zod'
import { SchemaParseFailedError } from '../errors'

export abstract class SchemaParser {
  static parse<T>(schema: z.Schema, data: unknown): T {
    const parsedSchema = schema.safeParse(data)
    const { error } = parsedSchema
    console.log(error?.format())
    if (error) {
      const { path, message } = error.errors[0]
      const errorMessage = message.toLowerCase()
      const isObjectParamError = path.length === 3
      if (!isObjectParamError) {
        const field = path[0]
        throw new SchemaParseFailedError(
          `Field '${field}' ${errorMessage === 'required' ? 'is ' + errorMessage : errorMessage}`,
        )
      }

      const object = path[1]
      const field = path[2]
      throw new SchemaParseFailedError(`${object} ${field} ${errorMessage}`)
    }
    return parsedSchema.data
  }
}
