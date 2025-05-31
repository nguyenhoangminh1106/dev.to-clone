import { render, screen } from "@testing-library/react";
import UserInfo from "~/components/UserInfo";
import { useSession } from "next-auth/react";
import type { User } from "@prisma/client";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe("UserInfo Component", () => {
  const mockUser: User = {
    id: "user1",
    name: "Test User",
    email: "test@example.com",
    emailVerified: null,
    image: "test-image.jpg",
    bio: "Test bio",
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
    (useSession as jest.Mock).mockReturnValue(mockSession);
  });

  it("renders user information correctly", () => {
    render(<UserInfo user={mockUser} />);

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Test bio")).toBeInTheDocument();
    expect(screen.getByAltText("Profile Picture")).toHaveAttribute(
      "src",
      "test-image.jpg",
    );
  });

  it("shows edit profile button for own profile", () => {
    render(<UserInfo user={mockUser} />);

    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
    expect(screen.queryByText("Follow")).not.toBeInTheDocument();
  });

  it("shows follow button for other users' profiles", () => {
    const otherUser: User = {
      ...mockUser,
      id: "user2",
    };

    render(<UserInfo user={otherUser} />);

    expect(screen.getByText("Follow")).toBeInTheDocument();
    expect(screen.queryByText("Edit Profile")).not.toBeInTheDocument();
  });

  it("displays default bio when bio is not provided", () => {
    const userWithoutBio: User = {
      ...mockUser,
      bio: null,
    };

    render(<UserInfo user={userWithoutBio} />);

    expect(screen.getByText("404 bio not found")).toBeInTheDocument();
  });

  it("displays default profile image when image is not provided", () => {
    const userWithoutImage: User = {
      ...mockUser,
      image: null,
    };

    render(<UserInfo user={userWithoutImage} />);

    const defaultImageUrl =
      "https://lyra-trial-1106.s3.ap-southeast-2.amazonaws.com/profileImage/6yvpkj.jpg";
    expect(screen.getByAltText("Profile Picture")).toHaveAttribute(
      "src",
      defaultImageUrl,
    );
  });

  it("renders social links and join date", () => {
    render(<UserInfo user={mockUser} />);

    expect(screen.getByText("Joined on Jul 30, 2024")).toBeInTheDocument();
    expect(screen.getByText("https://github.com/example")).toBeInTheDocument();
  });

  it("applies correct styling classes", () => {
    render(<UserInfo user={mockUser} />);

    const profileImage = screen.getByAltText("Profile Picture");
    expect(profileImage).toHaveClass("rounded-full");
    expect(profileImage).toHaveClass("border-4");
    expect(profileImage).toHaveClass("border-black");
  });
});
