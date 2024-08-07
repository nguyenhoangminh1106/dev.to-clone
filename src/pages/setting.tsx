import React, { useState, useRef, useEffect } from "react";
import Setting from "~/components/Setting";
import { useSession } from "next-auth/react";

/**
 * SETTING PAGE
 * @returns
 */
const SettingsPage = () => {
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="justify-center bg-gray-100 sm:flex sm:space-x-6 sm:px-1 lg:pl-60 lg:pr-64">
      {/* NavBar on the right */}
      <div className="flex hidden basis-1/4 flex-col space-y-1 py-4 pl-4 sm:block lg:mt-4">
        <button className="flex w-full items-center space-x-2 rounded-lg bg-white py-1 pl-2 pr-10 font-bold text-gray-700 hover:text-indigo-700">
          <span className="text-xl">😊</span>
          <span>Profile</span>
        </button>
        <button className="flex w-full items-center space-x-2 rounded-lg py-1 pl-2 pr-10 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700">
          <span className="text-xl">⚙️</span>
          <span>Customization</span>
        </button>
        <button className="flex w-full items-center space-x-2 rounded-lg py-1 pl-2 pr-10 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700">
          <span className="text-xl">📬</span>
          <span>Notifications</span>
        </button>
        <button className="flex w-full items-center space-x-2 rounded-lg py-1 pl-2 pr-10 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700">
          <span className="text-xl">🌱</span>
          <span>Account</span>
        </button>
        <button className="flex w-full items-center space-x-2 rounded-lg py-1 pl-2 pr-10 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700">
          <span className="text-xl">🏢</span>
          <span>Organization</span>
        </button>
        <button className="flex w-full items-center space-x-2 rounded-lg py-1 pl-2 pr-10 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700">
          <span className="text-xl">⚡</span>
          <span>Extensions</span>
        </button>
      </div>
      {/* Allow user to edit if signed in */}
      <div className="flex min-h-screen basis-3/4 flex-col justify-center sm:w-3/4 lg:mt-3">
        <div className="relative my-3 block sm:hidden" ref={dropdownRef}>
          <button
            onClick={handleToggle}
            className="mx-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-left text-gray-700 hover:border-2 hover:border-indigo-700 focus:outline-none"
          >
            Profile
            <span className="float-right">&#9662;</span> {/* Down arrow */}
          </button>
          {isOpen && (
            <div className="absolute mx-2 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg">
              <ul className="max-h-60 overflow-auto">
                <li className="px-2 hover:bg-gray-400">Profile</li>
                <li className="px-2 hover:bg-gray-400">Customization</li>
                <li className="px-2 hover:bg-gray-400">Notifications</li>
                <li className="px-2 hover:bg-gray-400">Account</li>
                <li className="px-2 hover:bg-gray-400">Organization</li>
                <li className="px-2 hover:bg-gray-400">Extensions</li>
              </ul>
            </div>
          )}
        </div>
        <p className="my-5 ml-2 text-2xl font-bold text-indigo-700 sm:text-3xl">
          @{session?.user.name}: {session?.user.id}
        </p>
        <div className="mx-auto mb-10 w-full flex-grow">
          <Setting />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
