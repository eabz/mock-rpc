import { createCors } from 'itty-cors'
import { Router } from 'itty-router'

import { handle } from '@/handler'
import { apiError } from '@/responses'
import { IEnv } from '@/types'

const { preflight, corsify } = createCors({
  methods: ['GET', 'POST'],
  origins: ['*'],
})

const router = Router()

router.all('*', preflight)
router.all('/', handle)

router.all('*', () => new Response('Not Found.', { status: 404 }))

export default {
  fetch: async (request: Request, env: IEnv, ctx: ExecutionContext): Promise<Response> => {
    try {
      const res = await router.handle(request, env, ctx)

      return corsify(res)
    } catch (e) {
      return apiError('internal server error', 500)
    }
  },
}
