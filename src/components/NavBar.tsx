import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const NavBar = () => {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 flex items-center justify-between bg-white px-2 py-2 shadow sm:px-5 md:px-12">
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
        <div className="relative ml-4 grow">
          <input
            type="text"
            placeholder="Search..."
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
          <span className="ml-2 text-sm text-gray-500">
            Not powered by Algolia
          </span>
        </div>
      </div>
      {session ? (
        <div className="flex items-center space-x-4">
          <Link href="/createPost">
            <button className="button-primary">Create Post</button>
          </Link>
          <div>
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <Image
                src={session.user.image ?? "/default-avatar.png"}
                alt="User Avatar"
                width={500}
                height={500}
                className="h-10 w-10 cursor-pointer rounded-full"
              />
              {isDropdownOpen && (
                <div className="absolute right-0 w-48 rounded-lg bg-white p-4 shadow-md transition duration-200 ease-in-out">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Account Details
                  </Link>
                  <Link
                    href="/create-post"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
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
