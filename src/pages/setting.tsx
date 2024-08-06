import React from "react";
import Setting from "~/components/Setting";
import { useSession } from "next-auth/react";

/**
 * SETTING PAGE
 * @returns
 */
const SettingsPage = () => {
  const { data: session } = useSession();

  return (
    <div className="flex justify-center bg-gray-100 px-1 lg:px-56">
      {/* NavBar on the right */}
      <div className="mt-6 flex hidden basis-1/4 flex-col space-y-2 p-4 sm:block">
        <button className="flex w-full items-center space-x-2 rounded-lg py-1 pl-2 pr-10 text-gray-700 hover:bg-white hover:text-black">
          <span className="text-xl">😊</span>
          <span>Profile</span>
        </button>
        <button className="flex w-full items-center space-x-2 rounded-lg py-1 pl-2 pr-10 text-gray-700 hover:bg-white hover:text-black">
          <span className="text-xl">⚙️</span>
          <span>Customization</span>
        </button>
        <button className="flex w-full items-center space-x-2 rounded-lg py-1 pl-2 pr-10 text-gray-700 hover:bg-white hover:text-black">
          <span className="text-xl">📬</span>
          <span>Notifications</span>
        </button>
        <button className="flex w-full items-center space-x-2 rounded-lg py-1 pl-2 pr-10 text-gray-700 hover:bg-white hover:text-black">
          <span className="text-xl">🌱</span>
          <span>Account</span>
        </button>
        <button className="flex w-full items-center space-x-2 rounded-lg py-1 pl-2 pr-10 text-gray-700 hover:bg-white hover:text-black">
          <span className="text-xl">🏢</span>
          <span>Organization</span>
        </button>
        <button className="flex w-full items-center space-x-2 rounded-lg py-1 pl-2 pr-10 text-gray-700 hover:bg-white hover:text-black">
          <span className="text-xl">⚡</span>
          <span>Extensions</span>
        </button>
      </div>
      {/* Allow user to edit if signed in */}
      <div className="ml-10 mt-5 flex min-h-screen basis-3/4 flex-col justify-center sm:w-3/4">
        <p className="my-5 text-3xl font-bold text-indigo-700">
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
