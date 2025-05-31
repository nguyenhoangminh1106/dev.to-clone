import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SharingUrl from "~/components/SharingUrl";

// Mock the clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe("SharingUrl Component", () => {
  const mockUrl = "https://example.com/post/123";

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the URL input and copy button", () => {
    render(<SharingUrl url={mockUrl} />);

    expect(screen.getByDisplayValue(mockUrl)).toBeInTheDocument();
    expect(screen.getByText("Copy")).toBeInTheDocument();
  });

  it("copies URL to clipboard when copy button is clicked", async () => {
    render(<SharingUrl url={mockUrl} />);

    const copyButton = screen.getByText("Copy");
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockUrl);
    expect(screen.getByText("Copied!")).toBeInTheDocument();
    expect(screen.getByText("Link copied to clipboard!")).toBeInTheDocument();
  });

  it("resets copy state after 2 seconds", async () => {
    render(<SharingUrl url={mockUrl} />);

    const copyButton = screen.getByText("Copy");
    fireEvent.click(copyButton);

    expect(screen.getByText("Copied!")).toBeInTheDocument();
    expect(screen.getByText("Link copied to clipboard!")).toBeInTheDocument();

    // Fast-forward 2 seconds
    jest.advanceTimersByTime(2000);

    expect(screen.getByText("Copy")).toBeInTheDocument();
    expect(
      screen.queryByText("Link copied to clipboard!"),
    ).not.toBeInTheDocument();
  });

  it("handles clipboard error gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    (navigator.clipboard.writeText as jest.Mock).mockRejectedValueOnce(
      new Error("Clipboard error"),
    );

    render(<SharingUrl url={mockUrl} />);

    const copyButton = screen.getByText("Copy");
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error copying to clipboard: ",
        expect.any(Error),
      );
    });

    expect(screen.getByText("Copy")).toBeInTheDocument();
    expect(
      screen.queryByText("Link copied to clipboard!"),
    ).not.toBeInTheDocument();
  });
});
