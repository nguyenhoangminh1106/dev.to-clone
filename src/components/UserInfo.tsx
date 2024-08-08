import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FaBirthdayCake, FaExternalLinkAlt, FaGithub } from "react-icons/fa";

/**
 * DISPLAY USER INFO
 * @param param0
 * @returns
 */
export default function UserInfo({ user }: { user: User }) {
  const { data: session } = useSession();
  const defaultProfileImage =
    "https://lyra-trial-1106.s3.ap-southeast-2.amazonaws.com/profileImage/6yvpkj.jpg";
  return (
    <div className="flex w-full justify-center">
      <div className="w-full transform lg:top-10 lg:w-3/4">
        <div className="relative rounded-md bg-white p-6 pb-12">
          <div className="absolute left-6 top-0 transform md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/3">
            <Image
              src={user?.image ?? defaultProfileImage}
              alt="Profile Picture"
              width={500}
              height={500}
              className="relative -top-8 h-16 w-16 rounded-full border-4 border-black md:h-32 md:w-32 md:border-8"
            />
          </div>
          {session?.user?.id === user?.id ? (
            <Link
              href="/setting"
              className="button-primary-filled absolute right-4 top-4 mt-2"
            >
              Edit Profile
            </Link>
          ) : (
            <div className="absolute right-4 top-4 mt-2">
              <Link
                href={`/user/${user?.id}`}
                className="button-primary-filled"
              >
                Follow
              </Link>
              <span className="mx-4 inline-block text-xl">•••</span>
            </div>
          )}

          <div>
            <div className="mt-16 md:text-center">
              <h1 className="text-2xl font-bold sm:text-3xl">{user?.name}</h1>
              <p className="pt-5 text-lg text-black">
                {user?.bio ?? "404 bio not found"}
              </p>
            </div>
            <div className="mt-4 flex flex-col justify-center text-gray-700 sm:flex-row sm:items-center sm:space-x-4">
              <div className="flex items-center pr-5">
                <FaBirthdayCake className="mr-2 text-gray-500" />
                <span>Joined on Jul 30, 2024</span>
              </div>

              <div className="flex items-center text-gray-500 hover:text-indigo-700 sm:pl-5">
                <FaExternalLinkAlt className="mr-2 text-gray-500" />
                <div>https://github.com/example</div>
                <div className="flex items-center">
                  <FaGithub className="ml-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
