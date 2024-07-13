import type { User } from '@/domain/models/user'
import type { GetUserByEmail } from '@/domain/usecases/get-user-by-email'
import { InexistentRegisteredUserWithGivenEmailError } from '@/application/usecases/app/get-user-by-email/errors'
import { notFound, ok } from '@/presentation/helpers/http-helpers'
import type { GetUserByEmailSchemaValidator } from '@/application/validation/schema/get-user-by-email-schema-validator'
import { GetUserByEmailController } from './get-user-by-email-controller'

type Sut = {
  sut: GetUserByEmailController
  getUserByEmailUseCase: GetUserByEmail
  getUserByEmailSchemaValidator: GetUserByEmailSchemaValidator
}

function makeGetUserByEmailSub(): GetUserByEmail {
  class GetUserByEmailStub implements GetUserByEmail {
    async execute(): Promise<User> {
      return Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        createdAt: new Date().toString(),
      })
    }
  }
  return new GetUserByEmailStub()
}

function makeGetUserByEmailSchemaValidatorStub(): GetUserByEmailSchemaValidator {
  class GetUserByEmailSchemaValidatorStub
    implements GetUserByEmailSchemaValidator
  {
    validate() {
      return {
        email: 'any_email',
      }
    }
  }
  return new GetUserByEmailSchemaValidatorStub()
}

function makeSut(): Sut {
  const getUserByEmailUseCase = makeGetUserByEmailSub()
  const getUserByEmailSchemaValidator = makeGetUserByEmailSchemaValidatorStub()
  const sut = new GetUserByEmailController(
    getUserByEmailUseCase,
    getUserByEmailSchemaValidator,
  )
  return { sut, getUserByEmailUseCase, getUserByEmailSchemaValidator }
}

describe('GetUserByEmailController', () => {
  const httpRequest = { params: { email: 'any_email' } }

  it('should return 404 if there is not a user with the given email', async () => {
    const { sut, getUserByEmailUseCase } = makeSut()
    vi.spyOn(getUserByEmailUseCase, 'execute').mockRejectedValueOnce(
      new InexistentRegisteredUserWithGivenEmailError('any_email'),
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse).toEqual(
      notFound(new InexistentRegisteredUserWithGivenEmailError('any_email')),
    )
  })

  it('should throw a schema validation error', async () => {
    const { sut, getUserByEmailSchemaValidator } = makeSut()
    vi.spyOn(getUserByEmailSchemaValidator, 'validate').mockImplementation(
      () => {
        throw new Error('any_error')
      },
    )

    expect(sut.handle(httpRequest)).rejects.toThrow(new Error('any_error'))
  })

  it('should throw the error if is not a known error', async () => {
    const { sut, getUserByEmailUseCase } = makeSut()
    vi.spyOn(getUserByEmailUseCase, 'execute').mockRejectedValueOnce(
      new Error('any_error'),
    )

    expect(sut.handle(httpRequest)).rejects.toThrow(new Error('any_error'))
  })

  it('should return 200 and the user data on success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(
      ok({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        createdAt: new Date().toString(),
      }),
    )
  })
})
