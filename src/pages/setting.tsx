import React from "react";
import Setting from "~/components/Setting";
import NavBar from "~/components/NavBar";
import Footer from "~/components/Footer";
import Head from "next/head";
import { useSession } from "next-auth/react";

const SettingsPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <NavBar />
      <div className="flex justify-between bg-gray-100 px-1 lg:px-56">
        <div className="mt-6 flex hidden flex-col space-y-3 p-4 sm:block">
          <button className="flex items-center space-x-2 rounded-lg py-1 pl-2 pr-10 text-gray-700 hover:bg-white hover:text-black">
            <span className="text-xl">😊</span>
            <span>Profile</span>
          </button>
          <button className="flex items-center space-x-2 rounded-lg py-1 pl-2 pr-10 text-gray-700 hover:bg-white hover:text-black">
            <span className="text-xl">⚙️</span>
            <span>Customization</span>
          </button>
          <button className="flex items-center space-x-2 rounded-lg py-1 pl-2 pr-10 text-gray-700 hover:bg-white hover:text-black">
            <span className="text-xl">📬</span>
            <span>Notifications</span>
          </button>
          <button className="flex items-center space-x-2 rounded-lg py-1 pl-2 pr-10 text-gray-700 hover:bg-white hover:text-black">
            <span className="text-xl">🌱</span>
            <span>Account</span>
          </button>
          <button className="flex items-center space-x-2 rounded-lg py-1 pl-2 pr-10 text-gray-700 hover:bg-white hover:text-black">
            <span className="text-xl">🏢</span>
            <span>Organization</span>
          </button>
          <button className="flex items-center space-x-2 rounded-lg py-1 pl-2 pr-10 text-gray-700 hover:bg-white hover:text-black">
            <span className="text-xl">⚡</span>
            <span>Extensions</span>
          </button>
        </div>
        <div className="mt-5 min-h-screen w-full sm:w-3/4">
          <p className="my-5 text-2xl font-bold text-indigo-700">
            @{session?.user.name}: {session?.user.id}
          </p>
          <div className="mx-auto flex-grow">
            <Setting />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SettingsPage;
