import { publicProcedure, router } from '../trpc'
import { z } from 'zod'
import m$auth from '../modules/auth.module'
import response from '../helpers/response'

const authRouter = router({
  register: publicProcedure
    .input(z.object({
      email: z.string().email().transform((val) => val.toLowerCase()),
      password: z.string().min(6),
      name: z.string().min(2)
    }))
    .mutation(async ({ input }) => {
      const register = await m$auth.register(input)

      return response.sendResponse(register)
    }),
  login: publicProcedure
    .input(z.object({
      email: z.string().email().transform((val) => val.toLowerCase()),
      password: z.string().min(6)
    }))
    .mutation(async ({ input }) => {
      const login = await m$auth.login(input)

      return response.sendResponse(login)
    })
})

export default authRouter
