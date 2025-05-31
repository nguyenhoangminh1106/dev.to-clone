import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/react";
import { useSession, signIn, signOut } from "next-auth/react";
import AuthButton from "../../components/AuthButton";

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

describe("AuthButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "loading",
    });

    const { getByText } = render(<AuthButton />);
    expect(getByText("Loading...")).toBeInTheDocument();
  });

  it("shows sign in button when not authenticated", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    const { getByText } = render(<AuthButton />);
    expect(getByText("Not signed in")).toBeInTheDocument();
    expect(getByText("Sign in")).toBeInTheDocument();
  });

  it("shows sign out button when authenticated", () => {
    const mockSession = {
      user: { email: "test@example.com" },
    };

    (useSession as jest.Mock).mockReturnValue({
      data: mockSession,
      status: "authenticated",
    });

    const { getByText } = render(<AuthButton />);
    expect(getByText("Signed in as test@example.com")).toBeInTheDocument();
    expect(getByText("Sign out")).toBeInTheDocument();
  });

  it("calls signIn when sign in button is clicked", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    const { getByText } = render(<AuthButton />);
    fireEvent.click(getByText("Sign in"));
    expect(signIn).toHaveBeenCalledTimes(1);
  });

  it("calls signOut when sign out button is clicked", () => {
    const mockSession = {
      user: { email: "test@example.com" },
    };

    (useSession as jest.Mock).mockReturnValue({
      data: mockSession,
      status: "authenticated",
    });

    const { getByText } = render(<AuthButton />);
    fireEvent.click(getByText("Sign out"));
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
