export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'

export type HttpStatusCode = 200 | 201 | 400 | 403 | 404 | 409 | 500

type Body = Record<string, unknown>
type Params = Record<string, string>
type Query = Record<string, string>
export type HttpRequest = {
  body?: Body
  params?: Params
  query?: Query
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
