import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Footer from "../../components/Footer";

describe("Footer", () => {
  it("renders the footer with all links", () => {
    const { getByText, getAllByRole } = render(<Footer />);

    // Check main content
    expect(getByText(/Thank you/)).toBeInTheDocument();
    expect(getByText(/Nam Dao/)).toBeInTheDocument();
    expect(getByText(/Lyra Technologies/)).toBeInTheDocument();
    expect(
      getByText(/This website was built for the Lyra Trial/),
    ).toBeInTheDocument();

    // Check navigation links
    expect(getByText("Home")).toBeInTheDocument();
    expect(getByText("Tags")).toBeInTheDocument();
    expect(getByText("About")).toBeInTheDocument();
    expect(getByText("Contact")).toBeInTheDocument();

    // Check technology links
    expect(getByText("T3 Stack")).toBeInTheDocument();
    expect(getByText("Railway")).toBeInTheDocument();
    expect(getByText("AWS")).toBeInTheDocument();
    expect(getByText("Vercel")).toBeInTheDocument();

    // Check copyright
    expect(getByText(/Minh Nguyen © 2024/)).toBeInTheDocument();
  });

  it("renders external links with target _blank", () => {
    const { getAllByRole } = render(<Footer />);
    const externalLinks = getAllByRole("link").filter(
      (link) => link.getAttribute("target") === "_blank",
    );

    // Check if all external links have target="_blank"
    expect(externalLinks).toHaveLength(5); // Lyra, T3 Stack, Railway, AWS, Vercel
    externalLinks.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  it("renders links with correct href attributes", () => {
    const { getByText } = render(<Footer />);

    // Check navigation links
    expect(getByText("Home").closest("a")).toHaveAttribute("href", "/");
    expect(getByText("Tags").closest("a")).toHaveAttribute("href", "#");
    expect(getByText("About").closest("a")).toHaveAttribute("href", "#");
    expect(getByText("Contact").closest("a")).toHaveAttribute("href", "#");

    // Check external links
    expect(getByText("Lyra Technologies").closest("a")).toHaveAttribute(
      "href",
      "https://www.lyratechnologies.com.au/",
    );
    expect(getByText("T3 Stack").closest("a")).toHaveAttribute(
      "href",
      "https://github.com/t3-oss/create-t3-app",
    );
    expect(getByText("Railway").closest("a")).toHaveAttribute(
      "href",
      "https://railway.app/",
    );
    expect(getByText("AWS").closest("a")).toHaveAttribute(
      "href",
      "https://aws.amazon.com/",
    );
    expect(getByText("Vercel").closest("a")).toHaveAttribute(
      "href",
      "https://vercel.com/",
    );
  });

  it("applies correct CSS classes", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer");

    expect(footer).toHaveClass("bg-gray-200", "p-4", "pt-5", "text-center");
  });
});
