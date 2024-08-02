import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { db } from "~/server/db";

export const commentRouter = createTRPCRouter({
  getByPostId: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ input }) => {
      const { postId } = input;
      const comments = await db.comment.findMany({
        where: { postId },
        include: { author: true },
      });
      return comments;
    }),

  add: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        content: z.string().min(1, "Comment cannot be empty"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { postId, content } = input;
      const newComment = await db.comment.create({
        data: {
          postId,
          content,
          authorId: ctx.session.user.id, // Assuming user ID is in the session
        },
      });
      return newComment;
    }),
});
