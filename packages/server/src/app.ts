import express from 'express'
import cors from 'cors'
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { z } from 'zod'

// created for each request
const createContext = ({
    req,
    res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();

const router = t.router;
const publicProcedure = t.procedure;

let id = 0;

const db = {
  posts: [
    {
      id: ++id,
      title: 'hello',
    },
  ]
};

const postRouter = router({
    createPost: publicProcedure
        .input(z.object({ title: z.string() }))
        .mutation(({ input }) => {
            console.log(input)
            const post = {
                id: ++id,
                ...input,
            };
            db.posts.push(post);
            return post;
        }),
    listPosts: publicProcedure.query(() => db.posts),
});

const appRouter = router({
    post: postRouter,
    getUser: publicProcedure.query((req) => {
        console.log(req)
        return { id: "nevermind", name: 'Bilbo Anjar' };
    }),
    listPosts: publicProcedure.query(() => db.posts),
    createUser: publicProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async ({ input }) => {
        // use your ORM of choice
        const post = {
            id: ++id,
            ...input,
        };
        db.posts.push(post);
        return post;
    }),
});

export type AppRouter = typeof appRouter;

const main = async () => {
    const app = express()
    const port = process.env.PORT || 8080
    
    app.use(express.json())
    app.use(express.urlencoded({ extended: true}))
    app.use(cors())

    app.use((req, _res, next) => {
        // request logger
        console.log('⬅️ ', req.method, req.path, req.body ?? req.query);
    
        next();
    });
    
    app.use(
        '/trpc',
        trpcExpress.createExpressMiddleware({
          router: appRouter,
          createContext,
        }),
    );
    
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
