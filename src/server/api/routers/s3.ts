import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { S3 } from "aws-sdk";
import { z } from "zod";

/**
 * HANDLE CONNECTION WITH S3 BUCKETS
 */
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Delete an image
export const deleteImage = async (imageUrl: string) => {
  const bucketName = process.env.AWS_BUCKET_NAME;
  if (!bucketName) {
    console.error(
      "AWS_BUCKET_NAME is not defined in the environment variables.",
    );
    return;
  }

  const key = imageUrl.split(".com/")[1];
  if (!key) {
    console.error("Invalid image URL format.");
    return;
  }

  const object = {
    Bucket: bucketName,
    Key: key,
  };

  await s3.deleteObject(object).promise();
};

export const s3Router = createTRPCRouter({
  // Get the Url of the image in S3
  getPresignedUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        filefolder: z.string(),
        filetype: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { filename, filefolder, filetype } = input;
      const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${filefolder}/${filename}`,
        Expires: 60, // URL expiration time in seconds
        ContentType: filetype,
      };
      const url = await s3.getSignedUrlPromise("putObject", s3Params);
      return { url };
    }),

  // Delete an image in S3
  deleteImage: publicProcedure
    .input(z.object({ imageUrl: z.string() }))
    .mutation(async ({ input }) => {
      const { imageUrl } = input;
      await deleteImage(imageUrl);
      return { success: true };
    }),
});
