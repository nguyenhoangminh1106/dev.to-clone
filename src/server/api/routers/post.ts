import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { db } from "~/server/db";
import { deleteImage } from "~/server/api/routers/s3";

/**
 * HANDLE POST REQUEST
 */
export const postRouter = createTRPCRouter({
  // Add a post to database
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

  // Get all the post has status "published" == true
  getPublishedPosts: publicProcedure
    .input(z.object({ query: z.string().optional() }))
    .query(async ({ input }) => {
      const { query } = input;

      const posts = await db.post.findMany({
        where: {
          AND: [
            { published: true },
            query ? { title: { contains: query, mode: "insensitive" } } : {},
          ],
        },
        include: {
          createdBy: true,
        },
      });

      return posts;
    }),

  // Return a list of post characteristic
  getPostById: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ input }) => {
      const { postId } = input;
      const post = await db.post.findUnique({
        where: { id: postId },
        include: { createdBy: true, Comment: true },
      });
      if (!post) {
        throw new Error("Post not found");
      }

      const title = post.title;
      const description = post.description;
      const body = post.body;
      const coverImage = post.coverImage;
      const createdBy = post.createdBy;
      const createdAt = post.createdAt;
      const comments = post.Comment;
      return {
        title,
        description,
        body,
        coverImage,
        createdBy,
        createdAt,
        comments,
      };
    }),

  // Delete a post using Id
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

  // Reverse the "published" status of a post
  togglePublish: publicProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ input }) => {
      const post = await db.post.findUnique({ where: { id: input.postId } });
      if (!post) {
        throw new Error("Post not found");
      }
      await db.post.update({
        where: { id: input.postId },
        data: { published: !post.published },
      });
      return { success: true };
    }),

  // Update the post
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
        data: {
          title,
          description,
          body,
          coverImage,
        },
      });

      // Delete the cover image from S3 if it exists
      if (post.coverImage) {
        await deleteImage(post.coverImage);
      }

      return { success: true };
    }),
});
