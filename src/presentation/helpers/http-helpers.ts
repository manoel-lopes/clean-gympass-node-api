import type { HttpResponse } from '@/infra/adapters/http/ports'

export const created = (): HttpResponse => ({ statusCode: 201 })

export const ok = (data: unknown): HttpResponse => ({
  statusCode: 200,
  body: data,
})

export const badRequest = ({ message }: Error): HttpResponse => ({
  statusCode: 400,
  body: { error: 'Bad Request', message },
})

export const forbidden = (): HttpResponse => ({
  statusCode: 403,
  body: { error: 'Forbidden' },
})

export const notFound = ({ message }: Error): HttpResponse => ({
  statusCode: 404,
  body: { error: 'Not Found', message },
})

export const conflict = ({ message }: Error): HttpResponse => ({
  statusCode: 409,
  body: { error: 'Conflict', message },
})
