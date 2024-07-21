import { InMemoryUserRepository } from '@/infra/repositories/in-memory/in-memory-user-repository'
import { InMemoryCheckInRepository } from '@/infra/repositories/in-memory/in-memory-check-in-repository'
import { PasswordEncryptorStub } from '@/infra/adapters/password-encryptor/stub/password-encryptor-stub'
import { InexistentRegisteredUser } from '@/application/errors'
import {
  CreateUserUseCase,
  AuthenticateUserUseCase,
} from '@/application/usecases/users'
import { CreateCheckInUseCase } from './create-check-in-use-case'

type Sut = {
  sut: CreateCheckInUseCase
  createUserUseCase: CreateUserUseCase
  authenticateUserUseCase: AuthenticateUserUseCase
}

function makeSut(): Sut {
  const userRepository = new InMemoryUserRepository()
  const checkInRepository = new InMemoryCheckInRepository()
  const passwordEncryptor = new PasswordEncryptorStub()
  const sut = new CreateCheckInUseCase(userRepository, checkInRepository)
  const createUserUseCase = new CreateUserUseCase(
    userRepository,
    passwordEncryptor,
  )
  const authenticateUserUseCase = new AuthenticateUserUseCase(
    userRepository,
    passwordEncryptor,
  )
  return { sut, createUserUseCase, authenticateUserUseCase }
}

describe('CreateCheckInUseCase', () => {
  it('should throw an error if there is not a registered user with the given user id', () => {
    const userId = 'any_non_existing_user_id'
    const gymId = 'any_non_existing_gym_id'
    const { sut } = makeSut()

    expect(sut.execute({ userId, gymId })).rejects.toThrowError(
      new InexistentRegisteredUser('id'),
    )
  })

  it('should correctly create a new check in', async () => {
    const gymId = 'any_gym_id'
    const { sut, createUserUseCase, authenticateUserUseCase } = makeSut()

    await createUserUseCase.execute({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    })

    const { id: userId } = await authenticateUserUseCase.execute({
      email: 'any_email',
      password: 'any_password',
    })

    await sut.execute({ userId, gymId })
  })
})
