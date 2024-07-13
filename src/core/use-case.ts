export type UseCase<Request = unknown, Response = void> = {
  execute(req: Request): Promise<Response>
}
