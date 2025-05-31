import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import CommentComponent from "../../components/Comment";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe("CommentComponent", () => {
  const mockComment = {
    id: "1",
    content: "Test comment content",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    postId: 1,
    authorId: "user1",
    author: {
      id: "user1",
      name: "Test User",
      image: "/test-avatar.png",
    },
  };

  it("renders comment with filled background", () => {
    const { getByText, getByAltText } = render(
      <CommentComponent comment={mockComment} isFilled={true} />,
    );

    expect(getByText("Test User")).toBeInTheDocument();
    expect(getByText("Test comment content")).toBeInTheDocument();
    expect(getByAltText("Avatar")).toHaveAttribute("src", "/test-avatar.png");
    expect(getByText("1 Jan")).toBeInTheDocument();
  });

  it("renders comment with border background", () => {
    const { container } = render(
      <CommentComponent comment={mockComment} isFilled={false} />,
    );

    const commentDiv = container.querySelector(
      ".comment-item > div > div:last-child",
    );
    expect(commentDiv).toHaveClass("border", "border-gray-100");
  });

  it("renders comment with default avatar when no image provided", () => {
    const commentWithoutImage = {
      ...mockComment,
      author: {
        ...mockComment.author,
        image: null,
      },
    };

    const { getByAltText } = render(
      <CommentComponent comment={commentWithoutImage} isFilled={true} />,
    );

    expect(getByAltText("Avatar")).toHaveAttribute(
      "src",
      "/default-avatar.png",
    );
  });

  it("renders 'Unknown' when author name is not provided", () => {
    const commentWithoutName = {
      ...mockComment,
      author: {
        ...mockComment.author,
        name: null,
      },
    };

    const { getByText } = render(
      <CommentComponent comment={commentWithoutName} isFilled={true} />,
    );

    expect(getByText("Unknown")).toBeInTheDocument();
  });
});
