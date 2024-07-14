import type { SchemaValidator } from '@/infra/adapters/validation/schemas/ports'
import type { GetUserByEmailRequest } from '@/application/usecases/app/get-user-by-email/ports'

export type GetUserByEmailSchemaValidator =
  SchemaValidator<GetUserByEmailRequest>
