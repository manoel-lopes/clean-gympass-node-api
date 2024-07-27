export class UserHasAlreadyCheckedInOnTheseDateError extends Error {
  constructor() {
    super('User has already checked in on these date')
    this.name = 'UserHasAlreadyCheckedInOnTheseDateError'
  }
}
