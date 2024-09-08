import type { SchemaValidator } from '../ports'

export class SchemaValidatorStub implements SchemaValidator {
  validate() {
    return {}
  }
}
