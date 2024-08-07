// UserProfile.tsx
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import type { ParsedUrlQuery } from "querystring";
import PostList from "~/components/PostList";
import { FaHashtag, FaRegComment, FaRegFileAlt } from "react-icons/fa";
import UserInfo from "~/components/UserInfo";
import LoadingBar from "~/components/LoadingBar";

/**
 * DISPLAY USER INFO, USER'S POSTS
 * @returns
 */
const UserProfile = () => {
  const router = useRouter();
  const { userId } = router.query as ParsedUrlQuery & { userId: string };

  // Fetch user profile data
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = api.user.getUserById.useQuery({ userId });

  return (
    <>
      {isLoading && <LoadingBar />}
      {isError && <p className="m-5 text-red-500">Error loading profile</p>}
      <div className="mx-1 flex flex-col items-center space-y-64 bg-gray-100 sm:space-y-56 md:mx-10 lg:mx-20">
        {user && <UserInfo user={user} />}

        <div className="w-full md:w-3/4">
          {" "}
          {/* Statistics */}
          <div className="sm:flex sm:space-x-4">
            <div className="mt-2 h-1/2 w-full rounded-lg bg-white p-4 sm:w-1/3">
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

            {/* List of posts from the user */}
            <div className="w-full sm:w-2/3">
              <PostList
                showCommentLists={false}
                posts={user?.posts ?? []}
                refetch={refetch}
                showHeaderLists={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
