import { describe, it, expect, beforeEach, vi } from "vitest";
import { createTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";
import { deleteImage } from "~/server/api/routers/s3";

// Mock the database
vi.mock("~/server/db", () => ({
  db: {
    post: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// Mock S3 deleteImage function
vi.mock("~/server/api/routers/s3", () => ({
  deleteImage: vi.fn(),
}));

describe("Post Router", () => {
  const caller = appRouter.createCaller({
    session: null,
    db: db,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createPost", () => {
    const mockPost = {
      title: "Test Post",
      description: "Test Description",
      body: "Test Body",
      coverImage: "test-image.jpg",
      createdById: "user1",
    };

    it("creates a new post successfully", async () => {
      const createdPost = {
        ...mockPost,
        id: 1,
        published: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        reactions: [0, 0, 0],
      };
      vi.mocked(db.post.create).mockResolvedValue(createdPost);

      const result = await caller.post.createPost(mockPost);

      expect(result).toEqual(createdPost);
      expect(db.post.create).toHaveBeenCalledWith({
        data: mockPost,
      });
    });

    it("throws error when title is missing", async () => {
      const invalidPost = { ...mockPost, title: "" };

      await expect(caller.post.createPost(invalidPost)).rejects.toThrow(
        "Title is required",
      );
    });

    it("throws error when body is missing", async () => {
      const invalidPost = { ...mockPost, body: "" };

      await expect(caller.post.createPost(invalidPost)).rejects.toThrow(
        "Body is required",
      );
    });
  });

  describe("updateReaction", () => {
    const mockPost = {
      id: 1,
      reactions: [0, 0, 0],
    };

    it("updates reaction count successfully", async () => {
      vi.mocked(db.post.findUnique).mockResolvedValue(mockPost as any);
      vi.mocked(db.post.update).mockResolvedValue({
        ...mockPost,
        reactions: [0, 1, 0],
      } as any);

      const result = await caller.post.updateReaction({ postId: 1, index: 1 });

      expect(result).toEqual([0, 1, 0]);
      expect(db.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { reactions: [0, 1, 0] },
      });
    });

    it("throws error when post not found", async () => {
      vi.mocked(db.post.findUnique).mockResolvedValue(null);

      await expect(
        caller.post.updateReaction({ postId: 999, index: 1 }),
      ).rejects.toThrow("Post not found");
    });
  });

  describe("getPublishedPosts", () => {
    const mockPosts = [
      {
        id: 1,
        title: "Test Post",
        description: "Test Description",
        body: "Test Body",
        coverImage: "test-image.jpg",
        published: true,
        createdById: "user1",
        createdBy: { id: "user1", name: "Test User" },
        Comment: [],
      },
    ];

    it("fetches published posts successfully", async () => {
      vi.mocked(db.post.findMany).mockResolvedValue(mockPosts as any);

      const result = await caller.post.getPublishedPosts({});

      expect(result).toEqual(mockPosts);
      expect(db.post.findMany).toHaveBeenCalledWith({
        where: {
          AND: [{ published: true }, {}],
        },
        include: {
          createdBy: true,
          Comment: true,
        },
        orderBy: undefined,
        take: undefined,
      });
    });

    it("filters posts by query", async () => {
      vi.mocked(db.post.findMany).mockResolvedValue(mockPosts as any);

      await caller.post.getPublishedPosts({ query: "test" });

      expect(db.post.findMany).toHaveBeenCalledWith({
        where: {
          AND: [
            { published: true },
            { title: { contains: "test", mode: "insensitive" } },
          ],
        },
        include: {
          createdBy: true,
          Comment: true,
        },
        orderBy: undefined,
        take: undefined,
      });
    });

    it("orders posts by comment count", async () => {
      vi.mocked(db.post.findMany).mockResolvedValue(mockPosts as any);

      await caller.post.getPublishedPosts({ filter: "comment" });

      expect(db.post.findMany).toHaveBeenCalledWith({
        where: {
          AND: [{ published: true }, {}],
        },
        include: {
          createdBy: true,
          Comment: true,
        },
        orderBy: {
          Comment: {
            _count: "desc",
          },
        },
        take: undefined,
      });
    });
  });

  describe("getPostById", () => {
    const mockPost = {
      id: 1,
      title: "Test Post",
      description: "Test Description",
      body: "Test Body",
      coverImage: "test-image.jpg",
      createdBy: { id: "user1", name: "Test User" },
      createdAt: new Date(),
      Comment: [],
      reactions: [0, 0, 0],
    };

    it("fetches post by id successfully", async () => {
      vi.mocked(db.post.findUnique).mockResolvedValue(mockPost as any);

      const result = await caller.post.getPostById({ postId: 1 });

      expect(result).toEqual({
        title: mockPost.title,
        description: mockPost.description,
        body: mockPost.body,
        coverImage: mockPost.coverImage,
        createdBy: mockPost.createdBy,
        createdAt: mockPost.createdAt,
        comments: mockPost.Comment,
        reactions: mockPost.reactions,
      });
    });

    it("throws error when post not found", async () => {
      vi.mocked(db.post.findUnique).mockResolvedValue(null);

      await expect(caller.post.getPostById({ postId: 999 })).rejects.toThrow(
        "Post not found",
      );
    });
  });

  describe("deletePost", () => {
    const mockPost = {
      id: 1,
      coverImage: "test-image.jpg",
    };

    it("deletes post successfully", async () => {
      vi.mocked(db.post.findUnique).mockResolvedValue(mockPost as any);
      vi.mocked(db.post.delete).mockResolvedValue(mockPost as any);
      vi.mocked(deleteImage).mockResolvedValue(undefined);

      const result = await caller.post.deletePost({ postId: 1 });

      expect(result).toEqual({ success: true });
      expect(db.post.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(deleteImage).toHaveBeenCalledWith("test-image.jpg");
    });

    it("throws error when post not found", async () => {
      vi.mocked(db.post.findUnique).mockResolvedValue(null);

      await expect(caller.post.deletePost({ postId: 999 })).rejects.toThrow(
        "Post not found",
      );
    });
  });

  describe("togglePublish", () => {
    const mockPost = {
      id: 1,
      published: false,
    };

    it("toggles publish status successfully", async () => {
      vi.mocked(db.post.findUnique).mockResolvedValue(mockPost as any);
      vi.mocked(db.post.update).mockResolvedValue({
        ...mockPost,
        published: true,
      } as any);

      const result = await caller.post.togglePublish({ postId: 1 });

      expect(result).toEqual({ success: true });
      expect(db.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { published: true },
      });
    });

    it("throws error when post not found", async () => {
      vi.mocked(db.post.findUnique).mockResolvedValue(null);

      await expect(caller.post.togglePublish({ postId: 999 })).rejects.toThrow(
        "Post not found",
      );
    });
  });

  describe("updatePost", () => {
    const mockPost = {
      id: 1,
      title: "Old Title",
      description: "Old Description",
      body: "Old Body",
      coverImage: "old-image.jpg",
    };

    const updateData = {
      postId: 1,
      title: "New Title",
      description: "New Description",
      body: "New Body",
      coverImage: "new-image.jpg",
    };

    it("updates post successfully", async () => {
      vi.mocked(db.post.findUnique).mockResolvedValue(mockPost as any);
      vi.mocked(db.post.update).mockResolvedValue({
        ...mockPost,
        ...updateData,
      } as any);
      vi.mocked(deleteImage).mockResolvedValue(undefined);

      const result = await caller.post.updatePost(updateData);

      expect(result).toEqual({ success: true });
      expect(db.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          title: updateData.title,
          description: updateData.description,
          body: updateData.body,
          coverImage: updateData.coverImage,
        },
      });
      expect(deleteImage).toHaveBeenCalledWith("old-image.jpg");
    });

    it("throws error when post not found", async () => {
      vi.mocked(db.post.findUnique).mockResolvedValue(null);

      await expect(
        caller.post.updatePost({ ...updateData, postId: 999 }),
      ).rejects.toThrow("Post not found");
    });

    it("throws error when title is missing", async () => {
      const invalidData = { ...updateData, title: "" };

      await expect(caller.post.updatePost(invalidData)).rejects.toThrow(
        "Title is required",
      );
    });

    it("throws error when body is missing", async () => {
      const invalidData = { ...updateData, body: "" };

      await expect(caller.post.updatePost(invalidData)).rejects.toThrow(
        "Body is required",
      );
    });
  });
});
