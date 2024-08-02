import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";

const NavBar = () => {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const defaultProfileImage =
    "https://lyra-trial-1106.s3.ap-southeast-2.amazonaws.com/profileImage/6yvpkj.jpg";

  const router = useRouter();
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router
        .push(`/?query=${encodeURIComponent(searchQuery)}`)
        .then(() => {
          console.error("Successfully navigating to the target page");
        })
        .catch((error) => {
          console.error("Error navigating to the target page: ", error);
        });
    }
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-white px-2 py-2 shadow sm:px-5 md:px-12">
      <div className="flex grow items-center">
        <Link href="/">
          <Image
            src="/images/dev.png"
            width={500}
            height={500}
            alt="Logo"
            className="h-10 w-10 cursor-pointer"
          />
        </Link>

        <form onSubmit={handleSearch} className="relative ml-4 grow">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-1/2 rounded-lg border p-2 pl-10 transition duration-200 hover:outline-none hover:ring-2 hover:ring-indigo-700"
          />
          <span className="absolute left-3 top-2.5 text-gray-500">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M21.53 20.47l-5.243-5.243A7.5 7.5 0 1 0 16.5 15.5l5.243 5.243a.75.75 0 0 0 1.06-1.06l-.273-.273zM15.5 10.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
              />
            </svg>
          </span>
        </form>
      </div>
      {session ? (
        <div className="flex items-center space-x-4">
          <Link href="/createPost">
            <button className="button-primary hidden md:block">
              Create Post
            </button>
          </Link>
          <div>
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <Image
                src={session.user.image ?? defaultProfileImage}
                alt="User Avatar"
                width={500}
                height={500}
                className="h-10 w-10 cursor-pointer rounded-full"
              />
              {isDropdownOpen && (
                <div className="absolute right-0 w-48 rounded-lg bg-white p-4 shadow-md transition duration-200 ease-in-out">
                  <Link
                    href={`/user/${session.user.id}`}
                    className="block truncate px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    {session.user.name}
                  </Link>
                  <Link
                    href="/createPost"
                    className="block truncate px-4 py-2 text-gray-700 hover:bg-gray-100 md:hidden"
                  >
                    Create Post
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex">
          <Link href="/signin">
            <button className="button-secondary">Log in</button>
          </Link>
          <Link href="/signup">
            <button className="button-primary">Create account</button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
