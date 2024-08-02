import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { api } from "~/utils/api";

import type { ParsedUrlQuery } from "querystring";
import { User } from "@prisma/client";
import PostList from "./PostList";
import Link from "next/link";

const PostComment = () => {
  const router = useRouter();
  const { postId } = router.query as ParsedUrlQuery & { postId: number };
  const [editError, setEditError] = useState("");

  const defaultProfileImage =
    "https://lyra-trial-1106.s3.ap-southeast-2.amazonaws.com/profileImage/6yvpkj.jpg";

  // Parse postId from query
  const numericPostId = typeof postId === "string" ? parseInt(postId, 10) : NaN;

  // Fetch post data using useQuery, only if numericPostId is valid
  const { data, error } = api.post.getPostById.useQuery(
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
      <span>{editError && <p style={{ color: "red" }}>{editError}</p>}</span>
      {/* Author Info */}
      <div className="mb-4 rounded-lg bg-white p-4 shadow-md">
        <div className="flex items-center">
          <Image
            src={user?.image || defaultProfileImage}
            alt="Author Avatar"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div className="ml-4">
            <h2 className="font-bold">{user?.name}</h2>
            <p className="text-gray-500">{user?.bio}</p>
            <Link href={`/user/${user?.id}`}>
              <button className="button-secondary mt-2">View Profile</button>
            </Link>
          </div>
        </div>
      </div>

      {/* More Posts */}
      <div className="mb-4 rounded-lg bg-white p-4 shadow-md">
        <h3 className="mb-4 text-lg font-semibold">More from {user?.name}</h3>
        <PostList
          posts={
            user?.posts.map((post) => ({
              ...post,
              createdBy: {
                id: post.createdById,
                name: user?.name,
                profileImage: user?.image,
              },
            })) ?? []
          }
        />
      </div>

      {/* Comments Section */}
      <div className="rounded-lg bg-white p-4 shadow-md">
        <h3 className="mb-4 text-lg font-semibold">Comments</h3>
        {/* Comments content here */}
      </div>
    </div>
  );
};

export default PostComment;
