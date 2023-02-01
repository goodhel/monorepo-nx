import prisma from '../helpers/db'
import { debug } from '../config/app.config.json'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface LoginType {
    email: string
    password: string
}

interface RegisterType {
    email: string
    password: string
    name: string
}

class _auth {
  login = async (body: LoginType) => {
    try {
      const schema = z.object({
        email: z.string().email().transform((val) => val.toLowerCase()),
        password: z.string().min(6)
      })

      schema.parse(body)

      const user = await prisma.user.findUnique({
        where: {
          email: body.email
        },
        select: {
          id: true,
          email: true,
          name: true,
          password: true
        }
      })

      if (!user) {
        return {
          status: false,
          code: 'NOT_FOUND',
          error: 'User not found'
        }
      }

      if (!bcrypt.compareSync(body.password, user.password)) {
        return {
          status: false,
          code: 'UNAUTHORIZED',
          error: 'Wrong password'
        }
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

      return {
        status: false,
        error: error.message
      }
    }
  }

  register = async (body: RegisterType) => {
    try {
      const schema = z.object({
        email: z.string().email().transform((val) => val.toLowerCase()),
        password: z.string().min(6),
        name: z.string().min(2)
      })

      schema.parse(body)

      const register = await prisma.user.create({
        data: {
          email: body.email,
          password: bcrypt.hashSync(body.password, 10),
          name: body.name,
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
  }
}

export default new _auth()
