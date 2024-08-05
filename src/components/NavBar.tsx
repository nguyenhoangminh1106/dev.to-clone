import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import LeftSideBar from "./LeftSideBar";
import { useRouter } from "next/router";

/**
 * NAVIGATION BAR
 * @returns 
 */
const NavBar = () => {
  const { data: session } = useSession();

  // Control the drop down menu from profile image
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // In small screen the bar will collapse
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const defaultProfileImage =
    "https://lyra-trial-1106.s3.ap-southeast-2.amazonaws.com/profileImage/6yvpkj.jpg";

  const router = useRouter();

  // Open and close left side bar in small screen
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Search in database
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

  // Control open/close of the search bar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setIsSearchBarVisible(false);
      }
    };

    if (isSearchBarVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchBarVisible]);

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between bg-white px-2 py-2 sm:px-5 md:px-20">
        <div className="flex grow items-center">
          <button
            onClick={toggleSidebar}
            className="mx-5 block text-2xl md:hidden"
          >
            &#9776; {/* Hamburger icon */}
          </button>
          <Link href="/">
            <Image
              src="/images/dev.png"
              width={500}
              height={500}
              alt="Logo"
              className="h-10 w-10 cursor-pointer"
            />
          </Link>

          <form
            onSubmit={handleSearch}
            className="relative ml-4 hidden grow md:flex"
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-2/3 rounded-lg border p-2 pl-10 transition duration-200 hover:outline-none hover:ring-2 hover:ring-indigo-700"
            />

            <FaSearch className="absolute left-3 top-2.5 text-xl text-gray-500" />
          </form>
        </div>

        {/* If signed in, can create post */}
        {session ? (
          <div className="flex items-center space-x-4">
            <button
              className="ml-4 text-gray-600 md:hidden"
              onClick={() => setIsSearchBarVisible(!isSearchBarVisible)}
            >
              <FaSearch className="text-xl text-gray-500" />
            </button>
            <Link href="/createPost">
              <button className="button-primary hidden md:block">
                Create Post
              </button>
            </Link>

            <FaBell className="text-xl text-gray-500" />

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
                  className="h-8 w-8 cursor-pointer rounded-full"
                />

                {/* Drop down menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 w-48 rounded-lg bg-white p-4 shadow-md transition duration-200 ease-in-out">
                    <Link
                      href={`/user/${session.user.id}`}
                      className="block truncate border-b-2 border-b-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <p>{session.user.name}</p>
                      <p className="truncate text-xs">{session.user.id}</p>
                    </Link>
                    <div className="block truncate px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </div>
                    <Link
                      href="/createPost"
                      className="block truncate px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Create Post
                    </Link>
                    <div className="block truncate px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Reading List
                    </div>
                    <Link
                      href="/setting"
                      className="block truncate border-b-2 border-b-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>

                    <button
                      onClick={() => signOut()}
                      className="block w-full border-t-2 border-gray-100 px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          // Not signed in
        ) : (
          <div className="flex">
            <Link href="/signin">
              <button className="button-secondary hidden md:block">
                Log in
              </button>
            </Link>
            <Link href="/signup">
              <button className="button-primary">Create account</button>
            </Link>
          </div>
        )}
      </nav>

      {/* Search bar in small screen */}
      <div
        ref={searchBarRef}
        className={`absolute left-0 block w-full bg-white px-5 py-2 shadow-md transition-all duration-300 ease-in-out md:hidden ${
          isSearchBarVisible ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <form onSubmit={handleSearch} className="flex w-full">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border p-2 pl-10 text-gray-100 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-700"
          />
          <button type="submit" className="hidden"></button>
        </form>
      </div>

      {/* Control open/close of search bar in small screen */}
      <span className="block sm:hidden">
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40" onClick={toggleSidebar}>
            <div className="fixed inset-0 right-2/3 bg-opacity-50"></div>
          </div>
        )}
        <div
          className={`fixed inset-y-0 left-0 z-50 transform bg-white shadow-lg transition-transform duration-100 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:w-64 md:translate-x-0 md:shadow-none`}
          style={{ width: "66.6667%" }} // 2/3 of the screen
        >
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-bold">DEV Community</h2>
            <button onClick={toggleSidebar} className="text-2xl">
              &times; {/* Close icon */}
            </button>
          </div>
          <LeftSideBar />
        </div>
      </span>
    </>
  );
};

export default NavBar;
