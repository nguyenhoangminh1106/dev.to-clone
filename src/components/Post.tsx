import Link from "next/link";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

import type { Post as PostType } from "@prisma/client";
import SharingUrl from "./SharingUrl";
import Comment from "./Comment";
import { FaRegComment, FaFire } from "react-icons/fa";

const Post = ({
  post,
  refetch,
  showComments,
}: {
  post: PostType;
  refetch: () => void;
  showComments: boolean;
}) => {
  const { data: session } = useSession();
  const [activePostMenu, setActivePostMenu] = useState<number | null>(null);
  const [isPublished, setIsPublished] = useState(post.published);
  const [isSharing, setisSharing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const deletePost = api.post.deletePost.useMutation();

  const togglePublishMutation = api.post.togglePublish.useMutation();
  const toggleDropdown = (postId: number) => {
    setActivePostMenu(activePostMenu === postId ? null : postId);
  };

  const router = useRouter();

  const defaultProfileImage =
    "https://lyra-trial-1106.s3.ap-southeast-2.amazonaws.com/profileImage/6yvpkj.jpg";

  const homeUrl = process.env.NEXT_PUBLIC_HOME_URL;

  // Fetch user profile data
  const { data: user } = api.user.getUserById.useQuery({
    userId: post.createdById,
  });

  const postId: number = post.id;
  const { data: comments } = api.comment.getByPostId.useQuery({
    postId,
  });

  const onTogglePublish = async () => {
    try {
      await togglePublishMutation.mutateAsync({ postId: post.id });
      setIsPublished(!isPublished);
      refetch();
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setActivePostMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );
    if (!confirmed) return;

    try {
      await deletePost.mutateAsync({ postId: post.id });
      refetch();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const onEdit = () => {
    router
      .push(`/editPost/${post.id}`)
      .then(() => {
        console.log("Navigation successful");
      })
      .catch((error) => {
        console.error("Error navigating to edit post:", error);
      });
  };

  const onShare = () => {
    setisSharing(!isSharing);
  };

  return (
    <div className="relative mx-1 my-2 sm:mx-0">
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="mb-4 flex items-center">
          <Link href={`/user/${user?.id}`}>
            <Image
              src={user?.image ?? defaultProfileImage}
              alt="Profile Image"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full"
            />
          </Link>
          <div className="ml-3">
            <p className="font-semibold">{user?.name ?? "Unknown"}</p>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>

        <div className="absolute right-0 top-0 mx-6 my-4">
          <button
            onClick={() => toggleDropdown(post.id)}
            className="text-gray-600 hover:text-gray-800"
          >
            <span className="inline-block text-xl">•••</span>
          </button>
          {activePostMenu === post.id && (
            <div
              ref={dropdownRef}
              className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-300 bg-white shadow-lg"
            >
              {session?.user?.id === post.createdById && (
                <>
                  <button
                    onClick={onEdit}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={onDelete}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Delete
                  </button>
                  <button
                    onClick={onTogglePublish}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    {isPublished ? "Hide" : "Show"}
                  </button>
                </>
              )}
              <button
                onClick={onShare}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Share
              </button>
              {isSharing && <SharingUrl url={`${homeUrl}/post/${post.id}`} />}
            </div>
          )}
        </div>

        <h1 className="mx-6 mt-2 text-3xl font-bold hover:text-indigo-700">
          <Link href={`/post/${post.id}`}>{post.title}</Link>
        </h1>

        <p className="mx-6 mt-2 text-gray-700">{post.description}</p>

        {showComments && (
          <div className="comments-list mt-4">
            <div className="flex items-center space-x-1">
              <p className="mx-6 flex items-center space-x-1 text-gray-500">
                <FaFire></FaFire>
                <span>13 reactions</span>
              </p>
              <p className="mx-6 flex items-center space-x-1 text-gray-500">
                <FaRegComment></FaRegComment>
                <span>{comments?.length} comments</span>
              </p>
            </div>
            {comments
              ?.slice(0, 3)
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((comment) => <Comment key={comment.id} comment={comment} />)}

            {comments && comments?.length > 0 && (
              <Link href={`/post/${post.id}`}>
                <p className="mx-6 mt-8 font-semibold text-gray-500">
                  View all {comments?.length} comments
                </p>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
