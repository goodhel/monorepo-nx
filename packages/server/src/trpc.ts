import { Context } from "./context";
import { TRPCError, initTRPC } from '@trpc/server';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware
export const mergeRouters = t.mergeRouters

const isAuthed = middleware(({ next, ctx }) => {
    if (!ctx.user) {
        throw new TRPCError({
            code: 'UNAUTHORIZED'
        });
    }

    return next();
}) 

export const authedProcedure = t.procedure.use(isAuthed);