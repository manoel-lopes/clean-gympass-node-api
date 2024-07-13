import { FastifyAdapter } from '@/infra/adapters/http/http-server/fasitfy-adapter'

import { SchemaParseFailedError } from '@/infra/adapters/validation/errors'
import { env } from '@/lib/env'
import { setRoutes } from './routes'

const app = new FastifyAdapter()
setRoutes(app)
app.setErrorHandler((error, _, res) => {
  if (error instanceof SchemaParseFailedError) {
    return res.status(400).json({ error: { message: error.message } })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: It should log to an external observability tool like DataDog/NewRelic/Sentry
  }

  return res.status(500).json({ error: 'Internal server error' })
})
export { app }
