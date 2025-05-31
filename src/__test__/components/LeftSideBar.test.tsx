import { render, screen } from "@testing-library/react";
import LeftSideBar from "~/components/LeftSideBar";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

// Mock tRPC API
jest.mock("~/utils/api", () => ({
  api: {
    utils: {
      getStats: {
        useQuery: jest.fn(),
      },
    },
  },
}));

describe("LeftSideBar Component", () => {
  const mockSession = {
    data: {
      user: {
        id: "user1",
        name: "Test User",
      },
    },
    status: "authenticated",
  };

  const mockStats = {
    totalUsers: 1000,
    totalPosts: 500,
    totalComments: 2000,
  };

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue(mockSession);
    (api.utils.getStats.useQuery as jest.Mock).mockReturnValue({
      data: mockStats,
      isError: false,
    });
  });

  it("renders community description", () => {
    render(<LeftSideBar />);

    expect(
      screen.getByText(/DEV Community is a community of/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/We're a place where coders share/),
    ).toBeInTheDocument();
  });

  it("displays statistics for signed-in users", () => {
    render(<LeftSideBar />);

    expect(screen.getByText("Right Now !!!")).toBeInTheDocument();
    expect(
      screen.getByText(`Total Users: ${mockStats.totalUsers}`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Total Posts: ${mockStats.totalPosts}`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Total Comments: ${mockStats.totalComments}`),
    ).toBeInTheDocument();
  });

  it("displays sign in buttons for non-signed-in users", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<LeftSideBar />);

    expect(screen.getByText("Create Account")).toBeInTheDocument();
    expect(screen.getByText("Log in")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<LeftSideBar />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Reading List")).toBeInTheDocument();
    expect(screen.getByText("Podcasts")).toBeInTheDocument();
    expect(screen.getByText("Videos")).toBeInTheDocument();
    expect(screen.getByText("Tags")).toBeInTheDocument();
    expect(screen.getByText("DEV Help")).toBeInTheDocument();
    expect(screen.getByText("Forem Shop")).toBeInTheDocument();
    expect(screen.getByText("Advertise on DEV")).toBeInTheDocument();
    expect(screen.getByText("DEV Challenges")).toBeInTheDocument();
    expect(screen.getByText("DEV Showcase")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText("Guides")).toBeInTheDocument();
    expect(screen.getByText("Software comparisons")).toBeInTheDocument();
  });

  it("renders other links section", () => {
    render(<LeftSideBar />);

    expect(screen.getByText("Others")).toBeInTheDocument();
    expect(screen.getByText("Code of Conduct")).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
  });

  it("displays error message when stats fail to load", () => {
    (api.utils.getStats.useQuery as jest.Mock).mockReturnValue({
      data: null,
      isError: true,
    });

    render(<LeftSideBar />);

    expect(screen.getByText("Error loading tatistics")).toBeInTheDocument();
  });

  it("renders navigation links with correct icons", () => {
    render(<LeftSideBar />);

    // Check if icons are rendered (they should have specific classes)
    expect(screen.getByText("Home").closest("a")).toHaveClass("text-blue-500");
    expect(screen.getByText("Reading List").closest("a")).toHaveClass(
      "text-green-500",
    );
    expect(screen.getByText("Podcasts").closest("a")).toHaveClass(
      "text-purple-500",
    );
    expect(screen.getByText("Videos").closest("a")).toHaveClass("text-red-500");
  });
});
