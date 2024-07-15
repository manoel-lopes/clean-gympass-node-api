import { z } from 'zod'
import { SchemaParseFailedError } from '../errors'

export abstract class SchemaParser {
  static parse<T>(schema: z.Schema, data: unknown): T {
    const parsedSchema = schema.safeParse(data)
    if (parsedSchema.success) {
      return parsedSchema.data
    }

    const { path, message } = parsedSchema.error.errors[0]
    const errorMessage = this.formatErrorMessage(path, message)
    throw new SchemaParseFailedError(errorMessage)
  }

  private static formatErrorMessage(
    path: (string | number)[],
    message: string,
  ): string {
    const [object, property] = path
    const normalizedMessage = message
      .toLowerCase()
      .replace('string must', 'must')

    if (!property) {
      return `Empty request ${object}`
    }

    if (normalizedMessage.includes('invalid')) {
      return `${this.capitalizeFirstLetter(normalizedMessage)} on request ${object === 'query' ? 'query params' : object}`
    }
    const objMapper: Record<string, string> = {
      body: 'Field',
      params: 'Route',
      query: 'Query',
    }
    const firstWord = `${objMapper[`${object}`]} param`
    return `${firstWord} '${property}' ${
      normalizedMessage === 'required'
        ? 'is ' + normalizedMessage
        : normalizedMessage
    }`
  }

  private static capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }
}
