import type { User } from '@/domain/models/user'
import type { SchemaValidator } from '@/infra/adapters/validation/schemas/ports'

export type CreateUserSchemaValidator = SchemaValidator<User>
