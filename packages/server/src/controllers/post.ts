import { router, publicProcedure } from "../trpc";
import { z } from 'zod'
import m$post from '../modules/post.module'
import { TRPCError } from "@trpc/server";

const postRouter = router({
    createPost: publicProcedure
        .input(z.object({ title: z.string() }))
        .mutation( async ({ input }) => {
            const data = await m$post.addTodo(input)

            return data
        }),
    listPosts: publicProcedure.query( async () => {
        const list = await m$post.listTodo()

        if (!list.status) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
            })
        }

        return list.data
    }),
});

export default postRouter