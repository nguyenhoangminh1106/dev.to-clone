import { render, screen } from "@testing-library/react";
import PostSideBar from "~/components/PostSideBar";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

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

// Mock the tRPC API
jest.mock("~/utils/api", () => ({
  api: {
    post: {
      getPostById: {
        useQuery: jest.fn(),
      },
    },
    user: {
      getUserById: {
        useQuery: jest.fn(),
      },
    },
  },
}));

describe("PostSideBar Component", () => {
  const mockPost = {
    id: 1,
    title: "Test Post",
    description: "Test description",
    body: "Test body",
    coverImage: null,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: "user1",
    createdBy: {
      id: "user1",
      name: "Test User",
      image: "test-image.jpg",
      bio: "Test bio",
    },
  };

  const mockUser = {
    id: "user1",
    name: "Test User",
    email: "test@example.com",
    emailVerified: null,
    image: "test-image.jpg",
    bio: "Test bio",
    posts: [
      {
        id: 1,
        title: "Post 1",
        description: "Description 1",
        body: "Body 1",
        coverImage: null,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: "user1",
      },
      {
        id: 2,
        title: "Post 2",
        description: "Description 2",
        body: "Body 2",
        coverImage: null,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: "user1",
      },
    ],
  };

  beforeEach(() => {
    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({
      query: { postId: "1" },
    });

    // Setup API mocks
    (api.post.getPostById.useQuery as jest.Mock).mockReturnValue({
      data: mockPost,
      error: null,
      refetch: jest.fn(),
    });

    (api.user.getUserById.useQuery as jest.Mock).mockReturnValue({
      data: mockUser,
      isError: false,
    });
  });

  it("renders author information correctly", () => {
    render(<PostSideBar />);

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Test bio")).toBeInTheDocument();
    expect(screen.getByAltText("Author Avatar")).toHaveAttribute(
      "src",
      "test-image.jpg",
    );
  });

  it("renders user location and work information", () => {
    render(<PostSideBar />);

    expect(screen.getByText("LOCATION")).toBeInTheDocument();
    expect(screen.getByText("Melbourne, Australia")).toBeInTheDocument();
    expect(screen.getByText("WORK")).toBeInTheDocument();
    expect(screen.getByText("Student")).toBeInTheDocument();
  });

  it("renders join date", () => {
    render(<PostSideBar />);

    expect(screen.getByText("JOINED")).toBeInTheDocument();
    expect(screen.getByText("Jul 30, 2024")).toBeInTheDocument();
  });

  it("renders 'More from' section with user's posts", () => {
    render(<PostSideBar />);

    expect(screen.getByText("More from")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  it("shows error message when post loading fails", () => {
    (api.post.getPostById.useQuery as jest.Mock).mockReturnValue({
      data: null,
      error: new Error("Failed to load post"),
      refetch: jest.fn(),
    });

    render(<PostSideBar />);

    expect(screen.getByText("Error loading post.")).toBeInTheDocument();
  });

  it("shows error message when user profile loading fails", () => {
    (api.user.getUserById.useQuery as jest.Mock).mockReturnValue({
      data: null,
      isError: true,
    });

    render(<PostSideBar />);

    expect(screen.getByText("Error loading profile")).toBeInTheDocument();
  });

  it("uses default profile image when user image is not provided", () => {
    const userWithoutImage = {
      ...mockUser,
      image: null,
    };

    (api.user.getUserById.useQuery as jest.Mock).mockReturnValue({
      data: userWithoutImage,
      isError: false,
    });

    render(<PostSideBar />);

    const defaultImageUrl =
      "https://lyra-trial-1106.s3.ap-southeast-2.amazonaws.com/profileImage/6yvpkj.jpg";
    expect(screen.getByAltText("Author Avatar")).toHaveAttribute(
      "src",
      defaultImageUrl,
    );
  });

  it("renders view profile button with correct link", () => {
    render(<PostSideBar />);

    const viewProfileButton = screen.getByText("View Profile");
    expect(viewProfileButton).toBeInTheDocument();
    expect(viewProfileButton.closest("a")).toHaveAttribute(
      "href",
      "/user/user1",
    );
  });
});
