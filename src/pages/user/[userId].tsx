// UserProfile.tsx
import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Image from "next/image";
import type { ParsedUrlQuery } from "querystring";
import NavBar from "~/components/NavBar";
import PostList from "~/components/PostList";
import Footer from "~/components/Footer";
import { FaHashtag, FaRegComment, FaRegFileAlt } from "react-icons/fa";

const UserProfile = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { userId } = router.query as ParsedUrlQuery & { userId: string };

  const defaultProfileImage =
    "https://lyra-trial-1106.s3.ap-southeast-2.amazonaws.com/profileImage/6yvpkj.jpg";

  // Fetch user profile data
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = api.user.getUserById.useQuery({ userId });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading profile.</p>;

  return (
    <div>
      <NavBar />
      <div className="flex flex-col items-center space-y-28 bg-gray-50 p-4">
        <div className="relative w-full">
          <div className="h-36 bg-gray-500"></div>
          <div className="absolute left-1/2 top-10 w-full -translate-x-1/2 transform px-4 md:w-3/4">
            <div className="relative mt-10 rounded-lg bg-white p-6 pb-28 shadow-lg">
              <div className="absolute left-1/2 top-0 -translate-x-52 translate-y-2 transform sm:-translate-x-1/2 sm:-translate-y-1/2">
                <Image
                  src={user?.image ?? defaultProfileImage}
                  alt="Profile Picture"
                  width={500}
                  height={500}
                  className="h-16 w-16 rounded-full border-4 border-gray-500 shadow-lg sm:h-32 sm:w-32 sm:border-8"
                />
              </div>
              {session?.user?.id === user?.id && (
                <Link
                  href="/setting"
                  className="button-primary absolute right-4 top-4"
                >
                  Edit Profile
                </Link>
              )}
              <div className="mt-16 sm:text-center">
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <p className="text-gray-500">
                  {user?.bio ?? "404 bio not found"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full px-4 pt-32 md:w-3/4">
          {" "}
          {/* New container to match the white rectangle width */}
          <div className="sm:flex sm:space-x-4">
            <div className="mt-2 h-1/2 w-full rounded-lg bg-white p-4 shadow-md sm:w-1/3">
              <div className="mb-4 flex items-center">
                <FaRegFileAlt className="mr-3 text-gray-500" size={24} />
                <span className="text-gray-700">
                  {user?.posts.length} posts published
                </span>
              </div>
              <div className="mb-4 flex items-center">
                <FaRegComment className="mr-3 text-gray-500" size={24} />
                <span className="text-gray-700">
                  {user?.Comment.length} comments written
                </span>
              </div>
              <div className="flex items-center">
                <FaHashtag className="mr-3 text-gray-500" size={24} />
                <span className="text-gray-700">0 tags followed</span>
              </div>
            </div>
            <div className="w-full sm:w-2/3">
              <PostList
                showCommentLists={false}
                posts={user?.posts ?? []}
                refetch={refetch}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserProfile;
