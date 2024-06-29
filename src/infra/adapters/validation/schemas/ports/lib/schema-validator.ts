export type SchemaValidator<T> = {
  validate: (data: unknown) => T
}
