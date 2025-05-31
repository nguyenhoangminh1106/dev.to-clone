import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Comments from "~/components/Comments";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

// Mock the next-auth session
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

// Mock the tRPC API
jest.mock("~/utils/api", () => ({
  api: {
    comment: {
      getByPostId: {
        useQuery: jest.fn(),
      },
      add: {
        useMutation: jest.fn(),
      },
    },
  },
}));

describe("Comments Component", () => {
  const mockComments = [
    {
      id: 1,
      content: "First comment",
      createdAt: new Date("2024-03-20T10:00:00Z"),
      userId: "user1",
      postId: 1,
      user: {
        id: "user1",
        name: "Test User",
        image: "test-image.jpg",
      },
    },
    {
      id: 2,
      content: "Second comment",
      createdAt: new Date("2024-03-20T11:00:00Z"),
      userId: "user2",
      postId: 1,
      user: {
        id: "user2",
        name: "Another User",
        image: "another-image.jpg",
      },
    },
  ];

  const mockSession = {
    data: {
      user: {
        id: "user1",
        name: "Test User",
        image: "test-image.jpg",
      },
    },
    status: "authenticated",
  };

  beforeEach(() => {
    // Setup session mock
    (useSession as jest.Mock).mockReturnValue(mockSession);

    // Setup API mocks
    (api.comment.getByPostId.useQuery as jest.Mock).mockReturnValue({
      data: mockComments,
      refetch: jest.fn(),
    });

    (api.comment.add.useMutation as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
    });
  });

  it("renders the comments section with correct title", () => {
    render(<Comments postId={1} isListFilled={true} />);
    expect(screen.getByText("Top comments (2)")).toBeInTheDocument();
  });

  it("renders the comment form with user image and textarea", () => {
    render(<Comments postId={1} isListFilled={true} />);
    expect(
      screen.getByPlaceholderText("Add to the discussion"),
    ).toBeInTheDocument();
    expect(screen.getByAltText("User Avatar")).toBeInTheDocument();
  });

  it("sorts comments by date in descending order", () => {
    render(<Comments postId={1} isListFilled={true} />);
    const comments = screen.getAllByTestId("comment-content");
    expect(comments[0]).toHaveTextContent("Second comment");
    expect(comments[1]).toHaveTextContent("First comment");
  });

  it("handles adding a new comment", async () => {
    const mockMutateAsync = jest.fn();
    (api.comment.add.useMutation as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });

    render(<Comments postId={1} isListFilled={true} />);

    const textarea = screen.getByPlaceholderText("Add to the discussion");
    const addButton = screen.getByText("Add comment");

    fireEvent.change(textarea, { target: { value: "New comment" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        postId: 1,
        content: "New comment",
      });
    });
  });

  it("clears the textarea after adding a comment", async () => {
    const mockMutateAsync = jest.fn();
    (api.comment.add.useMutation as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });

    render(<Comments postId={1} isListFilled={true} />);

    const textarea = screen.getByPlaceholderText("Add to the discussion");
    const addButton = screen.getByText("Add comment");

    fireEvent.change(textarea, { target: { value: "New comment" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(textarea).toHaveValue("");
    });
  });

  it("shows correct number of comments", () => {
    render(<Comments postId={1} isListFilled={true} />);
    expect(screen.getByText("Top comments (2)")).toBeInTheDocument();
  });
});
