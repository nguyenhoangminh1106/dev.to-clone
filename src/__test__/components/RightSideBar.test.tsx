import { render, screen } from "@testing-library/react";
import RightSideBar from "~/components/RightSideBar";
import { api } from "~/utils/api";

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

describe("RightSideBar Component", () => {
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
    (api.post.getPublishedPosts.useQuery as jest.Mock).mockReturnValue({
      data: mockPosts,
      isError: false,
      refetch: jest.fn(),
    });
  });

  it("renders active discussions section", () => {
    render(<RightSideBar />);

    expect(screen.getByText("Active discussions")).toBeInTheDocument();
    expect(screen.getByTestId("post-list")).toBeInTheDocument();
  });

  it("renders weekly challenges section", () => {
    render(<RightSideBar />);

    expect(
      screen.getByText("👋 What's happening this week"),
    ).toBeInTheDocument();
    expect(screen.getByText("Challenges 🤗")).toBeInTheDocument();
    expect(
      screen.getByText("Build Better on Stellar: Smart Contract Challenge"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Frontend Challenge: Recreation Edition"),
    ).toBeInTheDocument();
  });

  it("renders discuss section", () => {
    render(<RightSideBar />);

    expect(screen.getByText("#discuss")).toBeInTheDocument();
    expect(
      screen.getByText("Discussion threads targeting the whole community"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "I'm developing a minimalistic note-taking web app with custom widgets. Can you suggest any widgets you would like to see?",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Difference between RPM based and Debian based."),
    ).toBeInTheDocument();
  });

  it("renders about me section", () => {
    render(<RightSideBar />);

    expect(screen.getByText("About Me")).toBeInTheDocument();
    expect(screen.getByAltText("Profile Picture")).toBeInTheDocument();
    expect(screen.getByText(/Hi, I'm Minh!/)).toBeInTheDocument();
    expect(
      screen.getByText(/In my free time, I enjoy playing chess/),
    ).toBeInTheDocument();
    expect(screen.getByAltText("GitHub")).toBeInTheDocument();
    expect(screen.getByAltText("LinkedIn")).toBeInTheDocument();
  });

  it("displays error message when posts fail to load", () => {
    (api.post.getPublishedPosts.useQuery as jest.Mock).mockReturnValue({
      data: null,
      isError: true,
      refetch: jest.fn(),
    });

    render(<RightSideBar />);

    expect(screen.getByText("Error loading posts")).toBeInTheDocument();
  });

  it("renders challenge cards with correct information", () => {
    render(<RightSideBar />);

    const challengeCards = screen.getAllByRole("link");
    expect(challengeCards).toHaveLength(2);
    expect(challengeCards[0]).toHaveTextContent(
      "Build Better on Stellar: Smart Contract Challenge",
    );
    expect(challengeCards[1]).toHaveTextContent(
      "Frontend Challenge: Recreation Edition",
    );
  });

  it("renders discuss threads with correct metadata", () => {
    render(<RightSideBar />);

    expect(screen.getByText("1 comment")).toBeInTheDocument();
    expect(screen.getByText("No comments")).toBeInTheDocument();
    expect(screen.getByText("2 comments")).toBeInTheDocument();
    expect(screen.getAllByText("New")).toHaveLength(2);
  });
});
