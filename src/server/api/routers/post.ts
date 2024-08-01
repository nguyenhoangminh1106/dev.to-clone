import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { db } from "~/server/db";
import { deleteImage } from "~/server/api/routers/s3";

export const postRouter = createTRPCRouter({
  createPost: publicProcedure
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

  getPublishedPosts: publicProcedure.query(async () => {
    const post = await db.post.findMany({
      where: { published: true },
      include: {
        createdBy: true,
      },
    });
    return post;
  }),

  getPostById: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ input }) => {
      const { postId } = input;
      const post = await db.post.findUnique({
        where: { id: postId },
        include: { createdBy: true },
      });
      if (!post) {
        throw new Error("Post not found");
      }

      const title = post.title;
      const description = post.description;
      const body = post.body;
      const coverImage = post.coverImage;
      return { title, description, body, coverImage };
    }),

  deletePost: publicProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ input }) => {
      const { postId } = input;

      // Fetch the post to get the cover image URL
      const post = await db.post.findUnique({
        where: { id: postId },
        select: { coverImage: true },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      // Delete the post from the database
      await db.post.delete({
        where: { id: postId },
      });

      // Delete the cover image from S3 if it exists
      if (post.coverImage) {
        await deleteImage(post.coverImage);
      }

      return { success: true };
    }),

  hidePost: publicProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ input }) => {
      await db.post.update({
        where: { id: input.postId },
        data: { published: false },
      });
      return { success: true };
    }),

  updatePost: publicProcedure
    .input(
      z.object({
        postId: z.number(),
        title: z.string().min(1, "Title is required"),
        description: z.string(),
        body: z.string().min(1, "Body is required"),
        coverImage: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { postId, title, description, body, coverImage } = input;

      // Fetch the post to get the cover image URL
      const post = await db.post.findUnique({
        where: { id: postId },
        select: { coverImage: true },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      await db.post.update({
        where: { id: postId },
        data: { title, description, body, coverImage },
      });

      // Delete the cover image from S3 if it exists
      if (post.coverImage) {
        await deleteImage(post.coverImage);
      }

      return { success: true };
    }),
});
