import prisma from '../helpers/db'
import { publicProcedure, router } from '../trpc'
import { z } from 'zod'
import m$auth from '../modules/auth.module'
import response from '../helpers/response'
import { TRPCError } from '@trpc/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { debug } from '../config/app.config.json'

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
      try {
        const schema = z.object({
          email: z.string().email().transform((val) => val.toLowerCase()),
          password: z.string().min(6)
        }).safeParse(input)

        if (!schema.success) {
          const formatted = schema.error.issues.map((issue) => issue.message).join(', ')

          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: formatted
          })
        }

        const user = await prisma.user.findUnique({
          where: {
            email: input.email
          },
          select: {
            id: true,
            email: true,
            name: true,
            password: true
          }
        })

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found'
          })
        }

        if (!bcrypt.compareSync(input.password, user.password)) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Wrong password'
          })
        }

        const payload = {
          id: user.id,
          email: user.email
        }

        const token = jwt.sign(payload, 'secret-key-123', { expiresIn: '8h' })

        return {
          status: true,
          data: {
            test: 'test',
            token
          }
        }
      } catch (error: any) {
        if (debug) {
          console.error('login auth module Error: ', error)
        }

        throw new TRPCError({
          code: error.code ? error.code : 'BAD_REQUEST',
          message: error.message
        })
      }
    })
})

export default authRouter
