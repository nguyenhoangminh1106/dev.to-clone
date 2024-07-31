import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { S3 } from "aws-sdk";
import { z } from "zod";

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const s3Router = createTRPCRouter({
  getPresignedUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        filetype: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { filename, filetype } = input;
      const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `coverImage/${filename}`,
        Expires: 60, // URL expiration time in seconds
        ContentType: filetype,
      };
      const url = await s3.getSignedUrlPromise("putObject", s3Params);
      return { url };
    }),
});
