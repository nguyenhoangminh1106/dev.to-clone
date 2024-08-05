import Image from "next/image";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

import type { ParsedUrlQuery } from "querystring";
import PostList from "./PostList";
import Link from "next/link";

const PostSideBar = () => {
  const router = useRouter();
  const { postId } = router.query as ParsedUrlQuery & { postId: number };

  const defaultProfileImage =
    "https://lyra-trial-1106.s3.ap-southeast-2.amazonaws.com/profileImage/6yvpkj.jpg";

  // Parse postId from query
  const numericPostId = typeof postId === "string" ? parseInt(postId, 10) : NaN;

  // Fetch post data using useQuery, only if numericPostId is valid
  const { data, error, refetch } = api.post.getPostById.useQuery(
    { postId: numericPostId },
    { enabled: !isNaN(numericPostId) },
  );

  if (error) return <p>Error loading post.</p>;

  const authorId = data?.createdBy.id ?? "";

  // Fetch user profile data
  const {
    data: user,
    isLoading,
    isError,
  } = api.user.getUserById.useQuery({ userId: authorId });
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading profile.</p>;

  return (
    <div className="w-full">
      {/* Author Info */}
      <div className="mb-4 rounded-lg bg-white p-1 shadow-md">
        <div className="h-8 rounded-lg bg-black"></div>
        <div className="relative flex items-center">
          <Link href={`/user/${user?.id}`}>
            <Image
              src={user?.image ?? defaultProfileImage}
              alt="Author Avatar"
              width={50}
              height={50}
              className="absolute -top-5 left-6 h-10 w-10 rounded-full"
            />
          </Link>
          <div className="ml-20 mt-2">
            <h2 className="font-bold">{user?.name}</h2>
          </div>
        </div>
        <Link href={`/user/${user?.id}`}>
          <div className="my-5">
            <button className="button-primary-filled w-full">
              View Profile
            </button>
          </div>
        </Link>
        <div className="ml-4">
          <p className="text-gray-500">{user?.bio}</p>
        </div>
      </div>

      {/* More Posts */}
      <div className="mb-4 rounded-lg bg-white p-2 shadow-md">
        <h3 className="mb-4 text-lg font-semibold">
          More from <span className="text-indigo-700">{user?.name}</span>
        </h3>
        <PostList
          showCommentLists={false}
          posts={user?.posts ?? []}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default PostSideBar;
