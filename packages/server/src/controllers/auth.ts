import { publicProcedure, router } from '../trpc'
import { z } from 'zod'
import m$auth from '../modules/auth.module'
import response from '../helpers/response'
import { TRPCError } from '@trpc/server'

const authRouter = router({
  /**
   * Register User
   */
  register: publicProcedure
    .input(z.object({
      email: z.string(),
      password: z.string(),
      name: z.string()
    }))
    .mutation(async ({ input }) => {
      const register = await m$auth.register(input)

      return response.sendResponse(register)
    }),
  /**
   * Login User
   */
  login: publicProcedure
    .input(z.object({
      email: z.string(),
      password: z.string()
    }))
    .mutation(async ({ input }) => {
      const login = await m$auth.login(input)

      if (!login.status) {
        const code: any = login.code ? login.code : 'BAD_REQUEST'
        throw new TRPCError({
          code,
          message: login.error
        })
      }

      return login
    })
})

export default authRouter
