// src/server/routers/messages.ts
import { PrismaClient } from '@prisma/client';
import { router, publicProcedure, protectedProcedure } from './trpc';
import { z } from 'zod';

const prisma = new PrismaClient();

export const messagesRouter = router({
    getAll: publicProcedure.query(({ ctx }) => {
        console.log("TRYING TO GET ALL")
        return prisma.message.findMany({
            orderBy: { createdAt: 'desc' },
            include: { author: true },
        });
    }),

    create: protectedProcedure
        .input(z.object({ content: z.string().min(1).max(280) }))
        .mutation(({ ctx, input }) => {
            return prisma.message.create({
                data: {
                    content: input.content,
                    authorId: ctx.userId,
                },
            });
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const message = await prisma.message.findUnique({
                where: { id: input.id },
            });

            if (!message || message.authorId !== ctx.userId) {
                throw new Error('Not authorized');
            }

            return prisma.message.delete({
                where: { id: input.id },
            });
        }),
});