import type { ApiRequest, ApiResponse } from '@/infra/adapters/http/ports'

export type RouteHandler = (
  req: ApiRequest,
  res: ApiResponse,
) => Promise<unknown>
