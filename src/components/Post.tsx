import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { PostType } from "~/types";

const Post = ({
  post,
  onEdit = () => {},
  onDelete = () => {},
  onHide = () => {},
}: {
  post: PostType;
  onEdit: (postId: number) => void;
  onDelete: (postId: number) => void;
  onHide: (postId: number) => void;
}) => {
  const { data: session } = useSession();
  const [activePostMenu, setActivePostMenu] = useState<number | null>(null);

  const toggleDropdown = (postId: number) => {
    setActivePostMenu(activePostMenu === postId ? null : postId);
  };

  const defaultProfileImage =
    "https://lyra-trial-1106.s3.ap-southeast-2.amazonaws.com/profileImage/6yvpkj.jpg";

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
            </button>
            {activePostMenu === post.id && (
              <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-300 bg-white shadow-lg">
                <button
                  onClick={() => onEdit(post.id)}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(post.id)}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Delete
                </button>
                <button
                  onClick={() => onHide(post.id)}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Hide
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
