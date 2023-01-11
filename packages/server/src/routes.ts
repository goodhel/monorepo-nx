import { router } from "./trpc";
import postRouter from "./controllers/post";
import { z } from 'zod'
import { publicProcedure } from "./trpc";

// Router for TRPC
const appRouter = router({
    post: postRouter,
    getUser: publicProcedure.input(z.object({ name: z.string() }).optional()).query((req) => {
        console.log(req.ctx.user)
        const name = req.input ? req.input.name : 'no name';
        return { id: "nevermind", name: `The name from client is ${name}` };
    })
});

export default appRouter