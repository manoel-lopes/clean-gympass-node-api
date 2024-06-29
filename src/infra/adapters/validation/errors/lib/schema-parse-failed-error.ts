export class SchemaParseFailedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SchemaParseFailedError'
  }
}
