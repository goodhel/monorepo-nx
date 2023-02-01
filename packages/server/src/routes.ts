import { router, publicProcedure } from './trpc'
import { z } from 'zod'
import postRouter from './controllers/post'
import authRouter from './controllers/auth'

// Router for TRPC
const appRouter = router({
  post: postRouter,
  auth: authRouter,
  getUser: publicProcedure.input(z.object({ name: z.string() }).optional()).query((req) => {
    console.log(req.ctx.user)
    const name = req.input ? req.input.name : 'no name'
    return { id: 'nevermind', name: `The name from client is ${name}` }
  })
})

export default appRouter
