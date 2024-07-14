type Schema = Record<string, unknown>

export type SchemaValidator = {
  validate: (data: unknown) => Schema
}
