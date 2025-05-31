import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NavBar from "~/components/NavBar";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
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

// Mock LeftSideBar component
jest.mock("~/components/LeftSideBar", () => {
  return function MockLeftSideBar() {
    return <div data-testid="left-sidebar">Left Sidebar</div>;
  };
});

describe("NavBar Component", () => {
  const mockRouter = {
    push: jest.fn(),
  };

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
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSession as jest.Mock).mockReturnValue(mockSession);
    jest.clearAllMocks();
  });

  it("renders logo and search bar", () => {
    render(<NavBar />);

    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("shows create post button when user is signed in", () => {
    render(<NavBar />);

    expect(screen.getByText("Create Post")).toBeInTheDocument();
  });

  it("shows login and create account buttons when user is not signed in", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<NavBar />);

    expect(screen.getByText("Log in")).toBeInTheDocument();
    expect(screen.getByText("Create account")).toBeInTheDocument();
    expect(screen.queryByText("Create Post")).not.toBeInTheDocument();
  });

  it("handles search form submission", async () => {
    render(<NavBar />);

    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "test query" } });

    const form = searchInput.closest("form");
    if (!form) throw new Error("Form not found");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/?query=test%20query");
    });
  });

  it("toggles dropdown menu on hover", () => {
    render(<NavBar />);

    const avatar = screen.getByAltText("User Avatar");
    fireEvent.mouseEnter(avatar);

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("user1")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Create Post")).toBeInTheDocument();
    expect(screen.getByText("Reading List")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });

  it("handles sign out", () => {
    render(<NavBar />);

    const avatar = screen.getByAltText("User Avatar");
    fireEvent.mouseEnter(avatar);

    const signOutButton = screen.getByText("Sign Out");
    fireEvent.click(signOutButton);

    expect(signOut).toHaveBeenCalled();
  });

  it("toggles mobile search bar", () => {
    render(<NavBar />);

    const searchButton = screen.getAllByTestId("search-icon")[0];
    if (!searchButton) throw new Error("Search button not found");
    fireEvent.click(searchButton);

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("toggles mobile sidebar", () => {
    render(<NavBar />);

    const hamburgerButton = screen.getByText("☰");
    fireEvent.click(hamburgerButton);

    expect(screen.getByTestId("left-sidebar")).toBeInTheDocument();
  });

  it("closes mobile sidebar when clicking outside", () => {
    render(<NavBar />);

    // Open sidebar
    const hamburgerButton = screen.getByText("☰");
    fireEvent.click(hamburgerButton);

    // Click outside
    const overlay = screen.getByTestId("sidebar-overlay");
    if (!overlay) throw new Error("Overlay not found");
    fireEvent.click(overlay);

    expect(screen.queryByTestId("left-sidebar")).not.toBeVisible();
  });

  it("uses default profile image when user image is not provided", () => {
    const sessionWithoutImage = {
      data: {
        user: {
          id: "user1",
          name: "Test User",
          image: null,
        },
      },
      status: "authenticated",
    };

    (useSession as jest.Mock).mockReturnValue(sessionWithoutImage);

    render(<NavBar />);

    const defaultImageUrl =
      "https://lyra-trial-1106.s3.ap-southeast-2.amazonaws.com/profileImage/6yvpkj.jpg";
    expect(screen.getByAltText("User Avatar")).toHaveAttribute(
      "src",
      defaultImageUrl,
    );
  });
});
