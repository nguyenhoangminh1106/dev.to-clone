import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Reactions from "~/components/Reactions";
import { api } from "~/utils/api";

// Mock the tRPC API
jest.mock("~/utils/api", () => ({
  api: {
    post: {
      updateReaction: {
        useMutation: jest.fn(),
      },
    },
  },
}));

describe("Reactions Component", () => {
  const mockInitialReactions = [5, 3, 2, 1, 4];
  const mockPostId = 1;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it("renders all reaction emojis and their counts", () => {
    render(
      <Reactions postId={mockPostId} initialReactions={mockInitialReactions} />,
    );

    expect(screen.getByText("❤️")).toBeInTheDocument();
    expect(screen.getByText("🦄")).toBeInTheDocument();
    expect(screen.getByText("🤯")).toBeInTheDocument();
    expect(screen.getByText("🙏")).toBeInTheDocument();
    expect(screen.getByText("🔥")).toBeInTheDocument();

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("updates reaction count when clicked", async () => {
    const mockMutateAsync = jest.fn();
    (api.post.updateReaction.useMutation as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });

    render(
      <Reactions postId={mockPostId} initialReactions={mockInitialReactions} />,
    );

    const firstReaction = screen.getByText("❤️").parentElement;
    if (!firstReaction) throw new Error("Reaction element not found");

    fireEvent.click(firstReaction);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        postId: mockPostId,
        index: 0,
      });
    });

    // Check if the count was updated
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("reverts to initial state if API call fails", async () => {
    const mockMutateAsync = jest.fn().mockRejectedValue(new Error("API Error"));
    (api.post.updateReaction.useMutation as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });

    render(
      <Reactions postId={mockPostId} initialReactions={mockInitialReactions} />,
    );

    const firstReaction = screen.getByText("❤️").parentElement;
    if (!firstReaction) throw new Error("Reaction element not found");

    fireEvent.click(firstReaction);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        postId: mockPostId,
        index: 0,
      });
    });

    // Check if the count reverted to initial state
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("handles string postId by converting to number", async () => {
    const mockMutateAsync = jest.fn();
    (api.post.updateReaction.useMutation as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });

    render(<Reactions postId={123} initialReactions={mockInitialReactions} />);

    const firstReaction = screen.getByText("❤️").parentElement;
    if (!firstReaction) throw new Error("Reaction element not found");

    fireEvent.click(firstReaction);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        postId: 123,
        index: 0,
      });
    });
  });
});
