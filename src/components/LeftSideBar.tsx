import Link from "next/link";
import { FcHome, FcIdea } from "react-icons/fc";
import { FaTags, FaDev } from "react-icons/fa";
import { GrContact } from "react-icons/gr";
import { api } from "~/utils/api";

const LeftSideBar = () => {
  const { data, isLoading, isError } = api.utils.getStats.useQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading statistics!</p>;

  return (
    <div className="mt-5 rounded-lg p-2">
      <div className="mb-4 rounded-lg bg-gray-100 bg-white p-4">
        <h2 className="text-lg font-bold">DEV Community</h2>
        <p className="text-gray-600">
          We&apos;re a place where coders share, stay up-to-date, and grow their
          careers.
        </p>
        <div className="button-secondary decoration-none shadow-lg">
          <h2 className="mb-4 text-lg font-bold">Right Now !!!</h2>
          <div>
            <p>Total Users: {data?.totalUsers}</p>
            <p>Total Posts: {data?.totalPosts}</p>
            <p>Total Comments: {data?.totalComments}</p>
          </div>
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
