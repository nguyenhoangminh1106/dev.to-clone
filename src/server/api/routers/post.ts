import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { db } from "~/server/db";

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string(),
        body: z.string().min(1, "Body is required"),
        coverImage: z.string(),
        createdById: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { title, description, body, coverImage, createdById } = input;
      const newPost = await ctx.db.post.create({
        data: {
          title,
          description,
          body,
          coverImage,
          createdById,
        },
      });
      return newPost;
    }),

  getPosts: publicProcedure.query(async () => {
    const post = await db.post.findMany({
      include: {
        createdBy: true,
      },
    });
    return post;
  }),
});
