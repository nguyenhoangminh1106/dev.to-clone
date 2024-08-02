import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { api } from "~/utils/api";
import SharingUrl from "./SharingUrl";

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
    <div className="flex flex-wrap">
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
            <Image
              src={createdBy?.image ?? defaultProfileImage}
              alt="Author's Profile Image"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full"
            />
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
          <p>{body}</p>
        </div>
      </div>
    </div>
  );
};

export default PostContent;
