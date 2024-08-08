// UserProfile.tsx
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import type { ParsedUrlQuery } from "querystring";
import PostList from "~/components/PostList";
import { FaHashtag, FaRegComment, FaRegFileAlt } from "react-icons/fa";
import UserInfo from "~/components/UserInfo";

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
    isError,
    refetch,
  } = api.user.getUserById.useQuery({ userId });

  return (
    <>
      {isError && <p className="m-5 text-red-500">Error loading profile</p>}
      <div className="w-10xl h-10 bg-black sm:h-32"></div>

      <div className="flex flex-col items-center sm:-mt-12 lg:mx-24">
        <div className="w-full">{user && <UserInfo user={user} />}</div>

        <div className="w-full lg:w-3/4">
          {" "}
          {/* Statistics */}
          <div className="md:flex md:space-x-4">
            <div className="mt-2 h-1/2 w-full rounded-md bg-white p-4 md:w-1/3">
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
            <div className="w-full lg:w-2/3">
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
