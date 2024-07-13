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
      const object = path[0]
      let formattedErrorMessage = ''
      if (!field) {
        formattedErrorMessage = `Empty request ${object}`
      } else {
        if (errorMessage.includes('invalid')) {
          formattedErrorMessage = `${errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1)} on request ${
            object === 'query' ? 'query params' : object
          }`
        } else {
          formattedErrorMessage = `Field '${field}' ${
            errorMessage === 'required' ? 'is ' + errorMessage : errorMessage
          }`
        }
      }
      throw new SchemaParseFailedError(formattedErrorMessage)
    }
    return parsedSchema.data
  }
}
