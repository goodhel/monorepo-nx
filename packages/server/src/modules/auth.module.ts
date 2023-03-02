import prisma from '../helpers/db'
import { debug } from '../config/app.config.json'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'

class _auth {
  register = publicProcedure
    .input(z.object({
      email: z.string(),
      password: z.string(),
      name: z.string()
    }))
    .mutation(async ({ input }) => {
      try {
        const schema = z.object({
          email: z.string().email().transform((val) => val.toLowerCase()),
          password: z.string().min(6),
          name: z.string().min(2)
        }).safeParse(input)

        if (!schema.success) {
          const formatted = schema.error.issues.map((issue) => issue.message).join(', ')

          return {
            status: false,
            code: 'BAD_REQUEST',
            error: formatted
          }
        }

        const register = await prisma.user.create({
          data: {
            email: input.email,
            password: bcrypt.hashSync(input.password, 10),
            name: input.name,
            user_role: {
              create: {
                role_id: 2
              }
            }
          }
        })

        return {
          status: true,
          data: register
        }
      } catch (error: any) {
        if (error.code === 'P2002') {
          return {
            status: false,
            code: 'CONFLICT',
            error: 'Email already exists'
          }
        }

        if (debug) {
          console.error('register auth module Error: ', error)
        }

        return {
          status: false,
          error: error.message
        }
      }
    })

  login = publicProcedure
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
}

export default new _auth()
