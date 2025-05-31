import { render, screen } from "@testing-library/react";
import PostList from "~/components/PostList";
import type { Post as PostType } from "@prisma/client";

// Mock the Post component
jest.mock("~/components/Post", () => {
  return function MockPost({ post }: { post: PostType }) {
    return <div data-testid="post">{post.title}</div>;
  };
});

describe("PostList Component", () => {
  const mockPosts: PostType[] = [
    {
      id: 1,
      title: "First Post",
      description: "#tag1 #tag2",
      body: "Content of first post",
      coverImage: null,
      published: true,
      createdAt: new Date("2024-03-20T10:00:00Z"),
      updatedAt: new Date("2024-03-20T10:00:00Z"),
      createdById: "user1",
      reactions: [0, 0, 0, 0, 0],
    },
    {
      id: 2,
      title: "Second Post",
      description: "#tag3 #tag4",
      body: "Content of second post",
      coverImage: null,
      published: true,
      createdAt: new Date("2024-03-20T11:00:00Z"),
      updatedAt: new Date("2024-03-20T11:00:00Z"),
      createdById: "user2",
      reactions: [0, 0, 0, 0, 0],
    },
  ];

  const mockRefetch = jest.fn();

  it("renders posts in descending order by date", () => {
    render(
      <PostList
        posts={mockPosts}
        refetch={mockRefetch}
        showCommentLists={true}
        showHeaderLists={true}
      />,
    );

    const renderedPosts = screen.getAllByTestId("post");
    expect(renderedPosts[0]).toHaveTextContent("Second Post");
    expect(renderedPosts[1]).toHaveTextContent("First Post");
  });

  it("displays 'No posts available' when posts array is empty", () => {
    render(
      <PostList
        posts={[]}
        refetch={mockRefetch}
        showCommentLists={true}
        showHeaderLists={true}
      />,
    );

    expect(screen.getByText("No posts available")).toBeInTheDocument();
  });

  it("renders correct number of posts", () => {
    render(
      <PostList
        posts={mockPosts}
        refetch={mockRefetch}
        showCommentLists={true}
        showHeaderLists={true}
      />,
    );

    const renderedPosts = screen.getAllByTestId("post");
    expect(renderedPosts).toHaveLength(2);
  });

  it("passes correct props to Post component", () => {
    render(
      <PostList
        posts={mockPosts}
        refetch={mockRefetch}
        showCommentLists={true}
        showHeaderLists={true}
      />,
    );

    const renderedPosts = screen.getAllByTestId("post");
    expect(renderedPosts[0]).toHaveTextContent("Second Post");
    expect(renderedPosts[1]).toHaveTextContent("First Post");
  });
});
