// UserProfile.tsx
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
import UserInfo from "~/components/UserInfo";

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
    <div className="flex flex-col items-center space-y-28 bg-gray-100">
      {user && <UserInfo user={user} />}

      <div className="w-full pt-28 md:w-3/4">
        {" "}
        {/* New container to match the white rectangle width */}
        <div className="sm:flex sm:space-x-4">
          <div className="mt-2 h-1/2 w-full rounded-lg bg-white p-4 shadow-md sm:w-1/3">
            <div className="mb-4 flex items-center">
              <FaRegFileAlt className="mr-3 text-gray-500" size={24} />
              <span className="text-gray-700">
                {user?.posts?.length} posts published
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
  );
};

export default UserProfile;
