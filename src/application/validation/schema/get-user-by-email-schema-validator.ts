import type { SchemaValidator } from '@/infra/adapters/validation/schemas/ports'

export type GetUserByEmailRequestParams = {
  email: string
}

export type GetUserByEmailSchemaValidator =
  SchemaValidator<GetUserByEmailRequestParams>
