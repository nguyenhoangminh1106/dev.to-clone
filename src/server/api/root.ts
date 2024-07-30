import { postRouter } from "~/server/api/routers/post";
import {
  createCallerFactory,
  publicProcedure,
  createTRPCRouter,
} from "~/server/api/trpc";
import { db } from "~/server/db";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  getStats: publicProcedure.query(async () => {
    const totalUsers = await db.user.count();
    const totalPosts = await db.post.count();
    const totalComments = await db.comment.count();
    return { totalUsers, totalPosts, totalComments };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
