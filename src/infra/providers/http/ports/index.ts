export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'

export type HttpStatusCode = 200 | 201 | 400 | 403 | 404 | 409 | 500

export type HttpRequest = {
  body?: unknown
  params?: unknown
  query?: unknown
}

export type HttpResponse = {
  statusCode: HttpStatusCode
  body?: unknown
}

export type ApiRequest = HttpRequest

export type ApiResponse = {
  status(code: HttpStatusCode): { json(body?: unknown): unknown }
  send?(data: unknown): unknown
  data?: unknown
}

export type RouteHandler = (
  req: ApiRequest,
  res: ApiResponse,
) => Promise<unknown>
