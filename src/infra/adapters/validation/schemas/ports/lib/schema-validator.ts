export type SchemaValidator = {
  validate: (data: unknown) => Record<string, unknown>
}
