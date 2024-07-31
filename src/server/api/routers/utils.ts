import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const utilsRouter = createTRPCRouter({
  getStats: publicProcedure.query(async () => {
    const totalUsers = await db.user.count();
    const totalPosts = await db.post.count();
    const totalComments = await db.comment.count();
    return { totalUsers, totalPosts, totalComments };
  }),
});
