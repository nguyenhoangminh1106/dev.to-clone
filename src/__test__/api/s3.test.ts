import { describe, it, expect, beforeEach, vi } from "vitest";
import { createTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import { S3 } from "aws-sdk";

// Mock AWS S3
vi.mock("aws-sdk", () => ({
  S3: vi.fn().mockImplementation(() => ({
    getSignedUrlPromise: vi.fn(),
    deleteObject: vi.fn().mockReturnValue({
      promise: vi.fn(),
    }),
  })),
}));

describe("S3 Router", () => {
  const mockSession = {
    user: {
      id: "user1",
      name: "Test User",
    },
    expires: new Date().toISOString(),
  };

  const caller = appRouter.createCaller({
    session: mockSession,
    db: {} as any,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.AWS_BUCKET_NAME = "test-bucket";
  });

  describe("getPresignedUrl", () => {
    const mockInput = {
      filename: "test-image.jpg",
      filefolder: "posts",
      filetype: "image/jpeg",
    };

    it("generates presigned URL successfully", async () => {
      const mockUrl =
        "https://test-bucket.s3.amazonaws.com/posts/test-image.jpg";
      const mockS3 = new S3();
      vi.mocked(mockS3.getSignedUrlPromise).mockResolvedValue(mockUrl);

      const result = await caller.s3.getPresignedUrl(mockInput);

      expect(result).toEqual({ url: mockUrl });
      expect(mockS3.getSignedUrlPromise).toHaveBeenCalledWith("putObject", {
        Bucket: "test-bucket",
        Key: "posts/test-image.jpg",
        Expires: 60,
        ContentType: "image/jpeg",
      });
    });

    it("throws error when AWS_BUCKET_NAME is not defined", async () => {
      delete process.env.AWS_BUCKET_NAME;

      await expect(caller.s3.getPresignedUrl(mockInput)).rejects.toThrow();
    });

    it("throws error when user is not authenticated", async () => {
      const unauthenticatedCaller = appRouter.createCaller({
        session: null,
        db: {} as any,
      });

      await expect(
        unauthenticatedCaller.s3.getPresignedUrl(mockInput),
      ).rejects.toThrow();
    });
  });

  describe("deleteImage", () => {
    const mockImageUrl =
      "https://test-bucket.s3.amazonaws.com/posts/test-image.jpg";

    it("deletes image successfully", async () => {
      const mockS3 = new S3();
      vi.mocked(mockS3.deleteObject).mockReturnValue({
        promise: vi.fn().mockResolvedValue({}),
      });

      const result = await caller.s3.deleteImage({ imageUrl: mockImageUrl });

      expect(result).toEqual({ success: true });
      expect(mockS3.deleteObject).toHaveBeenCalledWith({
        Bucket: "test-bucket",
        Key: "posts/test-image.jpg",
      });
    });

    it("handles invalid image URL format", async () => {
      const invalidUrl = "https://invalid-url.com/image.jpg";

      const result = await caller.s3.deleteImage({ imageUrl: invalidUrl });

      expect(result).toEqual({ success: true });
      expect(new S3().deleteObject).not.toHaveBeenCalled();
    });

    it("handles missing AWS_BUCKET_NAME", async () => {
      delete process.env.AWS_BUCKET_NAME;

      const result = await caller.s3.deleteImage({ imageUrl: mockImageUrl });

      expect(result).toEqual({ success: true });
      expect(new S3().deleteObject).not.toHaveBeenCalled();
    });

    it("handles S3 deletion error", async () => {
      const mockS3 = new S3();
      vi.mocked(mockS3.deleteObject).mockReturnValue({
        promise: vi.fn().mockRejectedValue(new Error("S3 deletion failed")),
      });

      const result = await caller.s3.deleteImage({ imageUrl: mockImageUrl });

      expect(result).toEqual({ success: true });
      expect(mockS3.deleteObject).toHaveBeenCalledWith({
        Bucket: "test-bucket",
        Key: "posts/test-image.jpg",
      });
    });
  });
});
