import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { deleteImage } from "~/server/api/routers/s3";

export const userRouter = createTRPCRouter({
  getUserById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        include: { posts: true, Comment: true },
      });
      if (!user) throw new Error("User not found");
      return user;
    }),

  updateUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        bio: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        select: { image: true },
      });

      if (!user) {
        throw new Error("Post not found");
      }

      await ctx.db.user.update({
        where: { id: input.userId },
        data: {
          bio: input.bio,
          image: input.image,
        },
      });

      // Delete the cover image from S3 if it exists
      if (user.image) {
        await deleteImage(user.image);
      }

      return { success: true };
    }),
});
