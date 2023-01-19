import { Prisma } from '@prisma/client'
import prisma from '../helpers/db'

class _post {
  listTodo = async () => {
    try {
      const list = await prisma.todo.findMany()

      return {
        status: true,
        data: list
      }
    } catch (error) {
      console.log('listTodo todo module Error: ', error)

      return {
        status: false,
        error
      }
    }
  }

  getTodo = async (id: number) => {
    try {
      const detail = await prisma.todo.findUnique({
        where: {
          id
        }
      })

      if (!detail) {
        throw new Error('Todo not found')
      }

      return {
        status: true,
        data: detail
      }
    } catch (error) {
      console.error('getTodo todo module Error: ', error)

      return {
        status: false,
        error
      }
    }
  }

  addTodo = async (data: Prisma.TodoCreateInput) => {
    try {
      const add = await prisma.todo.create({
        data
      })

      return {
        status: true,
        data: add
      }
    } catch (error) {
      console.error('addTodo todo module Error: ', error)

      return {
        status: true,
        error
      }
    }
  }
}

export default new _post()
