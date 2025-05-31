import { render, screen } from "@testing-library/react";
import MainContent from "~/components/MainContent";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock PostList component
jest.mock("~/components/PostList", () => {
  return function MockPostList() {
    return <div data-testid="post-list">Post List</div>;
  };
});

// Mock tRPC API
jest.mock("~/utils/api", () => ({
  api: {
    post: {
      getPublishedPosts: {
        useQuery: jest.fn(),
      },
    },
  },
}));

describe("MainContent Component", () => {
  const mockRouter = {
    query: {},
  };

  const mockSession = {
    data: {
      user: {
        id: "user1",
        name: "Test User",
      },
    },
    status: "authenticated",
  };

  const mockPosts = [
    {
      id: "1",
      title: "Test Post",
      description: "Test Description",
      body: "Test Body",
      coverImage: "test-image.jpg",
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: "user1",
      reactions: {},
    },
  ];

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSession as jest.Mock).mockReturnValue(mockSession);
    (api.post.getPublishedPosts.useQuery as jest.Mock).mockReturnValue({
      data: mockPosts,
      isError: false,
      refetch: jest.fn(),
    });
  });

  it("renders welcome message for signed-in users", () => {
    render(<MainContent />);

    expect(
      screen.getByText("You're now a part of the community!"),
    ).toBeInTheDocument();
    expect(screen.getByText("Suggested things you can do")).toBeInTheDocument();
    expect(screen.getByText("Join the Welcome thread")).toBeInTheDocument();
    expect(
      screen.getByText("Write your first DEV Community post"),
    ).toBeInTheDocument();
    expect(screen.getByText("Customize your profile")).toBeInTheDocument();
  });

  it("renders challenges section for non-signed-in users", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<MainContent />);

    expect(screen.getByText("DEV Challenges")).toBeInTheDocument();
    expect(screen.getByText("DEV Challenge are Live 🚀")).toBeInTheDocument();
    expect(
      screen.getByText("The latest edition Frontend Challenge just launched"),
    ).toBeInTheDocument();
  });

  it("renders search results when query is present", () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { query: "test" },
    });

    render(<MainContent />);

    expect(screen.getByText('Search result for: "test"')).toBeInTheDocument();
  });

  it("renders error message when posts fail to load", () => {
    (api.post.getPublishedPosts.useQuery as jest.Mock).mockReturnValue({
      data: null,
      isError: true,
      refetch: jest.fn(),
    });

    render(<MainContent />);

    expect(screen.getByText("Error loading posts")).toBeInTheDocument();
  });

  it("renders post list with correct props", () => {
    render(<MainContent />);

    expect(screen.getByTestId("post-list")).toBeInTheDocument();
  });

  it("renders navigation tabs for non-signed-in users", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<MainContent />);

    expect(screen.getByText("Relevant")).toBeInTheDocument();
    expect(screen.getByText("Latest")).toBeInTheDocument();
    expect(screen.getByText("Top")).toBeInTheDocument();
  });
});
