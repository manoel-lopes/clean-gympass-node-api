import type { CreateUserRequest } from '@/domain/usecases/create-user'
import type { SchemaValidator } from '@/infra/adapters/validation/schemas/ports'

export type CreateUserSchemaValidator = SchemaValidator<CreateUserRequest>
