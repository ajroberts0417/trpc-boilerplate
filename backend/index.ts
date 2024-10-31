// src/server/index.ts
import express from 'express';
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';
import { clerkClient, clerkMiddleware } from '@clerk/express';
import { renderTrpcPanel } from "trpc-panel";
import { messagesRouter } from './routers/messages';
import { createContext } from './trpc';
// ...

// Create Express app
const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Vite's default port
    credentials: true,
}));

app.use(clerkMiddleware())

// Add tRPC middleware
app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
        router: messagesRouter,
        createContext,
    })
);

// migrate to deno.serve
app.use("/panel", (_, res) => {
    return res.send(
        renderTrpcPanel(messagesRouter, { url: "http://localhost:3000/trpc" })
    );
});

app.listen(3000, async () => {
    const token = await clerkClient.testingTokens.createTestingToken()
    console.log(token)
    console.log('Server running on port http://localhost:3000');
});

export type AppRouter = typeof messagesRouter;