// src/server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { clerkClient, getAuth } from '@clerk/express';

export async function createContext({ req, res }: CreateExpressContextOptions) {
    const { userId } = getAuth(req);
    const auth = getAuth(req);
    const users = await clerkClient.users.getUserList();
    console.log("USERS", users)
    console.log("AUTH", auth)
    console.log("CREATING CONTEXT", userId)
    console.log("REQ", req.auth)
    return { userId: userId ?? undefined, req, res };
}

type PublicContext = {
    userId: undefined;
    req: CreateExpressContextOptions['req'];
    res: CreateExpressContextOptions['res'];
};

type ProtectedContext = {
    userId: string;
    req: CreateExpressContextOptions['req'];
    res: CreateExpressContextOptions['res'];
};

export type Context = PublicContext | ProtectedContext;

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(async ({ ctx, next }) => {
    const auth = getAuth(ctx.req);
    console.log("INSIDE MIDDLEWARE", auth)
    if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
    return next({
        ctx: { ...ctx, userId: ctx.userId } as ProtectedContext,
    });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);