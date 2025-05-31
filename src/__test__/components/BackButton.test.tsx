import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/react";
import { useRouter } from "next/router";
import BackButton from "../../components/BackButton";

// Mock the next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("BackButton", () => {
  const mockBack = jest.fn();

  beforeEach(() => {
    // Setup router mock before each test
    const mockRouter = useRouter as jest.Mock;
    mockRouter.mockReturnValue({
      back: mockBack,
    });
  });

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  it("renders the back button", () => {
    const { getByText } = render(<BackButton />);
    expect(getByText("Back")).toBeInTheDocument();
  });

  it("calls router.back() when clicked", () => {
    const { getByText } = render(<BackButton />);
    const backButton = getByText("Back");

    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("has the correct CSS classes", () => {
    const { container } = render(<BackButton />);
    const button = container.querySelector("button");

    expect(button).toHaveClass("button-secondary");
    expect(container.firstChild).toHaveClass("z-40", "mx-2", "my-1");
  });
});
