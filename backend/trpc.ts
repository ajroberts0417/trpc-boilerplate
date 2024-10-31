// src/server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { clerkClient, getAuth, type User } from '@clerk/express';
import { prisma } from './prisma/client';

export async function createContext({ req, res }: CreateExpressContextOptions) {
    const { userId } = getAuth(req);

    let user = null;
    if (userId) {
        user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            const clerkUser = await clerkClient.users.getUser(userId);
            user = await prisma.user.create({
                data: {
                    clerkId: userId,
                    email: clerkUser.emailAddresses[0].emailAddress,
                    name: clerkUser.firstName
                        ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`
                        : undefined,
                    avatarUrl: clerkUser.imageUrl
                }
            });
        }
    }

    return { user, req, res };
}

type PublicContext = {
    user: null;
    req: CreateExpressContextOptions['req'];
    res: CreateExpressContextOptions['res'];
};

type ProtectedContext = {
    user: User;
    req: CreateExpressContextOptions['req'];
    res: CreateExpressContextOptions['res'];
};

export type Context = PublicContext | ProtectedContext;

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(async ({ ctx, next }) => {
    const auth = getAuth(ctx.req);
    console.log("INSIDE MIDDLEWARE", auth)
    if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
    return next({
        ctx: { ...ctx, user: ctx.user } as ProtectedContext,
    });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);