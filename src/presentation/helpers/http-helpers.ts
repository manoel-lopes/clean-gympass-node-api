import type { HttpResponse } from '@/infra/adapters/http/ports'

export const created = (): HttpResponse => ({ statusCode: 201 })

export const ok = (data: unknown): HttpResponse => ({
  statusCode: 200,
  body: data,
})

export const badRequest = ({ message }: Error): HttpResponse => ({
  statusCode: 400,
  body: { error: { message } },
})

export const forbidden = ({ message }: Error): HttpResponse => ({
  statusCode: 403,
  body: { error: { message } },
})

export const notFound = ({ message }: Error): HttpResponse => ({
  statusCode: 404,
  body: { error: { message } },
})

export const conflict = ({ message }: Error): HttpResponse => ({
  statusCode: 409,
  body: { error: { message } },
})
