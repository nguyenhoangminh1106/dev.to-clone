import { describe, it, expect, beforeEach, vi } from "vitest";
import { createTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";
import { deleteImage } from "~/server/api/routers/s3";

// Mock the database
vi.mock("~/server/db", () => ({
  db: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

// Mock S3 deleteImage function
vi.mock("~/server/api/routers/s3", () => ({
  deleteImage: vi.fn(),
}));

describe("User Router", () => {
  const mockSession = {
    user: {
      id: "user1",
      name: "Test User",
    },
    expires: new Date().toISOString(),
  };

  const caller = appRouter.createCaller({
    session: mockSession,
    db: db,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUserById", () => {
    const mockUser = {
      id: "user1",
      name: "Test User",
      email: "test@example.com",
      bio: "Test Bio",
      image: "test-image.jpg",
      posts: [],
      Comment: [],
    };

    it("fetches user by id successfully", async () => {
      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser as any);

      const result = await caller.user.getUserById({ userId: "user1" });

      expect(result).toEqual(mockUser);
      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user1" },
        include: { posts: true, Comment: true },
      });
    });

    it("throws error when user not found", async () => {
      vi.mocked(db.user.findUnique).mockResolvedValue(null);

      await expect(
        caller.user.getUserById({ userId: "nonexistent" }),
      ).rejects.toThrow("User not found");
    });
  });

  describe("updateUser", () => {
    const mockUser = {
      id: "user1",
      image: "old-image.jpg",
    };

    const updateData = {
      userId: "user1",
      bio: "New Bio",
      image: "new-image.jpg",
    };

    it("updates user successfully", async () => {
      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(db.user.update).mockResolvedValue({
        ...mockUser,
        ...updateData,
      } as any);
      vi.mocked(deleteImage).mockResolvedValue(undefined);

      const result = await caller.user.updateUser(updateData);

      expect(result).toEqual({ success: true });
      expect(db.user.update).toHaveBeenCalledWith({
        where: { id: "user1" },
        data: {
          bio: updateData.bio,
          image: updateData.image,
        },
      });
      expect(deleteImage).toHaveBeenCalledWith("old-image.jpg");
    });

    it("throws error when user not found", async () => {
      vi.mocked(db.user.findUnique).mockResolvedValue(null);

      await expect(
        caller.user.updateUser({ ...updateData, userId: "nonexistent" }),
      ).rejects.toThrow("Post not found");
    });

    it("throws error when user is not authenticated", async () => {
      const unauthenticatedCaller = appRouter.createCaller({
        session: null,
        db: db,
      });

      await expect(
        unauthenticatedCaller.user.updateUser(updateData),
      ).rejects.toThrow();
    });

    it("updates only bio when image is not provided", async () => {
      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(db.user.update).mockResolvedValue({
        ...mockUser,
        bio: "New Bio",
      } as any);

      const result = await caller.user.updateUser({
        userId: "user1",
        bio: "New Bio",
      });

      expect(result).toEqual({ success: true });
      expect(db.user.update).toHaveBeenCalledWith({
        where: { id: "user1" },
        data: {
          bio: "New Bio",
          image: undefined,
        },
      });
    });

    it("updates only image when bio is not provided", async () => {
      vi.mocked(db.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(db.user.update).mockResolvedValue({
        ...mockUser,
        image: "new-image.jpg",
      } as any);
      vi.mocked(deleteImage).mockResolvedValue(undefined);

      const result = await caller.user.updateUser({
        userId: "user1",
        image: "new-image.jpg",
      });

      expect(result).toEqual({ success: true });
      expect(db.user.update).toHaveBeenCalledWith({
        where: { id: "user1" },
        data: {
          bio: undefined,
          image: "new-image.jpg",
        },
      });
      expect(deleteImage).toHaveBeenCalledWith("old-image.jpg");
    });
  });
});
