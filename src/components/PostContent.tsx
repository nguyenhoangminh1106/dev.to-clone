import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { api } from "~/utils/api";
import SharingUrl from "./SharingUrl";
import Link from "next/link";
import Comments from "./Comments";
import ReactMarkdown from "react-markdown";
import { FaHeart, FaComment, FaBookmark, FaEllipsisH } from "react-icons/fa";

import type { ParsedUrlQuery } from "querystring";
import type { User } from "@prisma/client";
import type { DateTime } from "aws-sdk/clients/devicefarm";

const PostContent = () => {
  const router = useRouter();
  const { postId } = router.query as ParsedUrlQuery & { postId: number };
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [createdBy, setCreatedBy] = useState<User | null>(null);
  const [createdAt, setCreatedAt] = useState<DateTime | null>(null);
  const [isSharing, setisSharing] = useState(false);

  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [editError, setEditError] = useState("");

  const defaultProfileImage =
    "https://lyra-trial-1106.s3.ap-southeast-2.amazonaws.com/profileImage/6yvpkj.jpg";

  const homeUrl = process.env.NEXT_PUBLIC_HOME_URL;

  // Parse postId from query
  const numericPostId = typeof postId === "string" ? parseInt(postId, 10) : NaN;

  // Fetch post data using useQuery, only if numericPostId is valid
  const { data, error } = api.post.getPostById.useQuery(
    { postId: numericPostId },
    { enabled: !isNaN(numericPostId) },
  );

  const onShare = () => {
    setisSharing(!isSharing);
  };

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setDescription(data.description);
      setBody(data.body);
      setCoverImage(data.coverImage);
      setCreatedBy(data.createdBy);
      setCreatedAt(data.createdAt);
    } else if (error) {
      console.error("Error fetching post:", error);
      setEditError(`Error fetching post.`);
    }
  }, [data, error]);

  return (
    <div className="justify-center sm:flex sm:space-x-6">
      <div className="mt-10 flex hidden flex-col items-center space-y-10 py-4 text-gray-700 sm:block">
        <div className="flex flex-col items-center">
          <FaHeart className="text-xl text-gray-400" />
          <span className="text-sm">0</span>
        </div>
        <div className="flex flex-col items-center">
          <FaComment className="text-xl text-gray-400" />
          <span className="text-sm">0</span>
        </div>
        <div className="flex flex-col items-center">
          <FaBookmark className="text-xl text-gray-400" />
          <span className="text-sm">1</span>
        </div>
        <div className="flex flex-col items-center">
          <FaEllipsisH className="text-xl text-gray-400" />
        </div>
      </div>
      <div className="flex w-full flex-wrap">
        <span>{editError && <p style={{ color: "red" }}>{editError}</p>}</span>
        <div className="mx-auto w-full rounded-lg bg-white p-4 shadow-md">
          {coverImage && (
            <div className="relative mb-4 h-64 w-full overflow-hidden rounded-lg">
              <Image
                src={coverImage}
                alt="Cover Image"
                layout="fill"
                objectFit="cover"
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="relative mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <Link href={`/user/${createdBy?.id}`}>
                <Image
                  src={createdBy?.image ?? defaultProfileImage}
                  alt="Author's Profile Image"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                />
              </Link>
              <div className="ml-3">
                <p className="font-semibold">{createdBy?.name}</p>
                <p className="text-sm text-gray-500">
                  Posted on {createdAt?.toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <button onClick={onShare} className="button-secondary">
                Share
              </button>
              <div
                className={`absolute right-0 top-full mt-2 bg-white transition-all duration-1000 ease-in-out ${
                  isSharing ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <SharingUrl url={`${homeUrl}/post/${postId}`} />
              </div>
            </div>
          </div>

          <h1 className="mb-4 text-3xl font-bold">{title}</h1>
          <div className="mb-4 flex items-center">
            <div className="flex space-x-2 text-gray-500">{description}</div>
          </div>
          <div className="prose my-12 max-w-full">
            <ReactMarkdown>{body}</ReactMarkdown>
          </div>
        </div>

        {/* Comments Section */}
        <div
          id="comment"
          className="mt-1 w-full rounded-lg bg-white p-4 shadow-md"
        >
          <Comments postId={numericPostId} />
        </div>
      </div>
    </div>
  );
};

export default PostContent;
