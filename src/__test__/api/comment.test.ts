import { describe, it, expect, beforeEach, vi } from "vitest";
import { createTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";

// Mock the database
vi.mock("~/server/db", () => ({
  db: {
    comment: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe("Comment Router", () => {
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

  describe("getByPostId", () => {
    const mockComments = [
      {
        id: 1,
        content: "Test Comment",
        postId: 1,
        authorId: "user1",
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: "user1",
          name: "Test User",
        },
      },
    ];

    it("fetches comments by post id successfully", async () => {
      vi.mocked(db.comment.findMany).mockResolvedValue(mockComments as any);

      const result = await caller.comment.getByPostId({ postId: 1 });

      expect(result).toEqual(mockComments);
      expect(db.comment.findMany).toHaveBeenCalledWith({
        where: { postId: 1 },
        include: { author: true },
      });
    });

    it("returns empty array when no comments found", async () => {
      vi.mocked(db.comment.findMany).mockResolvedValue([]);

      const result = await caller.comment.getByPostId({ postId: 999 });

      expect(result).toEqual([]);
      expect(db.comment.findMany).toHaveBeenCalledWith({
        where: { postId: 999 },
        include: { author: true },
      });
    });
  });

  describe("add", () => {
    const mockComment = {
      id: 1,
      content: "Test Comment",
      postId: 1,
      authorId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("creates a new comment successfully", async () => {
      vi.mocked(db.comment.create).mockResolvedValue(mockComment as any);

      const result = await caller.comment.add({
        postId: 1,
        content: "Test Comment",
      });

      expect(result).toEqual(mockComment);
      expect(db.comment.create).toHaveBeenCalledWith({
        data: {
          postId: 1,
          content: "Test Comment",
          authorId: "user1",
        },
      });
    });

    it("throws error when content is empty", async () => {
      await expect(
        caller.comment.add({
          postId: 1,
          content: "",
        }),
      ).rejects.toThrow("Comment cannot be empty");
    });

    it("throws error when user is not authenticated", async () => {
      const unauthenticatedCaller = appRouter.createCaller({
        session: null,
        db: db,
      });

      await expect(
        unauthenticatedCaller.comment.add({
          postId: 1,
          content: "Test Comment",
        }),
      ).rejects.toThrow();
    });
  });
});
