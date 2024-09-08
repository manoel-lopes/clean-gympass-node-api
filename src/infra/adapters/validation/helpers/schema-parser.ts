import { z } from 'zod'
import { SchemaParseFailedError } from '../errors'

export abstract class SchemaParser {
  static parse<T>(schema: z.Schema, data: unknown): T {
    const parsedSchema = schema.safeParse(data)
    if (parsedSchema.success) {
      return parsedSchema.data
    }

    const error = parsedSchema.error.errors[0]
    const path = error?.path || []
    const message = error?.message || 'Unknown error'
    const errorMessage = this.formatErrorMessage(path, message)
    throw new SchemaParseFailedError(errorMessage)
  }

  private static formatErrorMessage(
    path: (string | number)[],
    message: string,
  ) {
    const [object, property] = path
    const normalizedMessage = this.normalizeMessage(message)

    if (!property) {
      return this.formatEmptyRequestError(object)
    }

    if (object) {
      if (this.isInvalidPropertyErrorMessage(normalizedMessage)) {
        return this.formatInvalidFieldError(object, normalizedMessage)
      }
      return this.formatFieldError(object, property, normalizedMessage)
    }
    return this.capitalizeFirstLetter(normalizedMessage)
  }

  private static normalizeMessage(message: string): string {
    return message.toLowerCase().replace('string must', 'must')
  }

  private static formatEmptyRequestError(object?: string | number) {
    return !object ? 'Empty request' : `Empty request ${object}`
  }

  private static isInvalidPropertyErrorMessage(message: string) {
    return message.includes('invalid')
  }

  private static formatInvalidFieldError(
    object: string | number,
    message: string,
  ): string {
    const objectType = object === 'query' ? 'query params' : object
    return `${this.capitalizeFirstLetter(message)} on request ${objectType}`
  }

  private static formatFieldError(
    object: string | number,
    property: string | number,
    message: string,
  ): string {
    const objectLabel = this.getObjectLabel(object)
    const messageText = message === 'required' ? 'is required' : message
    return `${objectLabel} '${property}' ${messageText}`
  }

  private static getObjectLabel(object: string | number): string {
    const objMapper: Record<string, string> = {
      body: 'Field',
      params: 'Route',
      query: 'Query',
    }
    return objMapper[`${object}`] || 'Unknown'
  }

  private static capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }
}
