import express from 'express'
import cors from 'cors'
import * as trpcExpress from '@trpc/server/adapters/express'
import { createContext } from './context'
import appRouter from './routes'

export type AppRouter = typeof appRouter;

const main = async () => {
  const app = express()
  const port = process.env.PORT || 8080

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cors())

  app.use((req, _res, next) => {
    // request logger
    console.log('⬅️ ', req.method, req.path, req.body ?? req.query)

    next()
  })

  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext
    })
  )

  app.get('/', async (req, res) => {
    res.status(200).send({
      message: 'Welcome to API Server Monorepo'
    })
  })

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
  })
}

main()
