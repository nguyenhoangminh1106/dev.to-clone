import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

import type { PostType } from "~/types";

const Post = ({ post }: { post: PostType }) => {
  const { data: session } = useSession();
  const [activePostMenu, setActivePostMenu] = useState<number | null>(null);
  const [isPublished, setIsPublished] = useState(post.published);
  const [status, setStatus] = useState("");

  const deletePost = api.post.deletePost.useMutation();

  const togglePublishMutation = api.post.togglePublish.useMutation();
  const toggleDropdown = (postId: number) => {
    setActivePostMenu(activePostMenu === postId ? null : postId);
  };

  const router = useRouter();

  const defaultProfileImage =
    "https://lyra-trial-1106.s3.ap-southeast-2.amazonaws.com/profileImage/6yvpkj.jpg";

  const onTogglePublish = async () => {
    try {
      setStatus("Changing...");
      await togglePublishMutation.mutateAsync({ postId: post.id });
      setIsPublished(!isPublished);
      setStatus("");
      window.location.reload();
    } catch (error) {
      console.error("Error toggling publish status:", error);
      setStatus("Error toggling publish status.");
    }
  };

  const onDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );
    if (!confirmed) return;

    setStatus("Deleting...");
    try {
      await deletePost.mutateAsync({ postId: post.id });
      setStatus("");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting post:", error);
      setStatus("Error deleting post.");
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
        setStatus("Error navigating to edit post.");
      });
  };

  return (
    <div className="relative my-4">
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="mb-4 flex items-center">
          <Image
            src={post.createdBy.profileImage ?? defaultProfileImage}
            alt="Profile Image"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="ml-3">
            <p className="font-semibold">{post.createdBy.name ?? "Unknown"}</p>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>

        {session?.user?.id === post.createdById && (
          <div className="absolute right-0 top-0 mx-6 my-4">
            <button
              onClick={() => toggleDropdown(post.id)}
              className="text-gray-600 hover:text-gray-800"
            >
              <span className="inline-block text-xl">•••</span>
              <span>{status && <p style={{ color: "red" }}>{status}</p>}</span>
            </button>
            {activePostMenu === post.id && (
              <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-300 bg-white shadow-lg">
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
              </div>
            )}
          </div>
        )}
        <Link href={`/post/${post.id}`}>
          <h1 className="mx-6 mt-2 text-3xl font-bold">{post.title}</h1>
          <p className="mx-6 mt-2 text-gray-700">{post.description}</p>
          {post.coverImage && (
            <Image
              src={post.coverImage}
              alt="Cover"
              width={500}
              height={300}
              className="mx-auto my-6 rounded-lg object-cover"
            />
          )}
        </Link>
      </div>
    </div>
  );
};

export default Post;
