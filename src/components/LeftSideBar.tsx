import { useSession } from "next-auth/react";
import Link from "next/link";
import { FcHome, FcReading, FcIdea } from "react-icons/fc";
import { FaTags, FaDev } from "react-icons/fa";
import { GrContact } from "react-icons/gr";

const LeftSideBar = () => {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  return (
    <div className="mt-5 rounded-lg p-2">
      <div className="mb-4 rounded-lg bg-gray-100 bg-white p-4">
        <h2 className="text-lg font-bold">DEV Community</h2>
        <p className="text-gray-600">
          We&apos;re a place where coders share, stay up-to-date, and grow their
          careers.
        </p>
        <div className="mt-4 space-y-2">
          <button className="button-primary w-full">Create account</button>
          <button className="button-secondary w-full">Log in</button>
        </div>
      </div>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/" className="button-secondary flex items-center">
              <span className="flex">
                <FcHome /> <span className="mx-1"></span>Home
              </span>
            </Link>
          </li>
          {currentUserId && (
            <li>
              <Link
                href={`/users/${currentUserId}/readinglist`}
                className="button-secondary flex items-center"
              >
                <span className="mr-2">
                  <FcReading /> Reading List
                </span>
              </Link>
            </li>
          )}
          <li>
            <Link href="/tags" className="button-secondary flex items-center">
              <span className="flex">
                <FaTags /> <span className="mx-1"></span>Tags
              </span>
            </Link>
          </li>
          <li>
            <Link href="/FAQ" className="button-secondary flex items-center">
              <span className="flex">
                <FcIdea /> <span className="mx-1"></span>FAQ
              </span>
            </Link>
          </li>
          <li>
            <Link href="/About" className="button-secondary flex items-center">
              <span className="flex">
                <FaDev /> <span className="mx-1"></span>About
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/Contact"
              className="button-secondary flex items-center"
            >
              <span className="flex">
                <GrContact /> <span className="mx-1"></span>Contact
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default LeftSideBar;
