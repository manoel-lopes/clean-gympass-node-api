export type UseCase<Input = unknown, Output = void> = {
  execute(input: Input): Promise<Output>
}
