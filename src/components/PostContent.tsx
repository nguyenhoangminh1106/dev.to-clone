import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { api } from "~/utils/api";
import SharingUrl from "./SharingUrl";
import Link from "next/link";
import Comments from "./Comments";
import ReactMarkdown from "react-markdown";
import Reactions from "./Reactions";

import {
  FavoriteBorder,
  ChatBubbleOutline,
  BookmarkBorder,
  MoreHoriz,
} from "@mui/icons-material";

import type { ParsedUrlQuery } from "querystring";
import type { User } from "@prisma/client";
import type { DateTime } from "aws-sdk/clients/devicefarm";

/**
 * THE MAIN CONTENT OF EACH POST
 * @returns
 */
const PostContent = () => {
  const router = useRouter();
  const { postId } = router.query as ParsedUrlQuery & { postId: number };
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [createdBy, setCreatedBy] = useState<User | null>(null);
  const [createdAt, setCreatedAt] = useState<DateTime | null>(null);
  const [reactions, setRections] = useState<number[] | null>(null);

  const [comments, setComments] = useState<
    | {
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        postId: number;
        authorId: string;
      }[]
    | null
  >(null);

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

  // Get the post details
  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setDescription(data.description);
      setBody(data.body);
      setCoverImage(data.coverImage);
      setCreatedBy(data.createdBy);
      setCreatedAt(data.createdAt);
      setComments(data.comments);
      setRections(data.reactions);
    } else if (error) {
      console.error("Error fetching post:", error);
      setEditError(`Error fetching post.`);
    }
  }, [data, error]);

  return (
    <div className="justify-center sm:flex sm:space-x-6">
      {/* Reaction/Comments/Tags Icon */}
      <div className="mt-10 flex hidden flex-col items-center space-y-10 py-4 text-gray-700 sm:block">
        <div className="flex flex-col items-center">
          <FavoriteBorder className="text-xl" />
          <span className="text-sm">
            {reactions ? reactions.reduce((acc, num) => acc + num, 0) : 0}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <ChatBubbleOutline className="text-xl" />
          <span className="text-sm">{comments?.length}</span>
        </div>
        <div className="flex flex-col items-center">
          <BookmarkBorder className="text-xl" />
          <span className="text-sm">
            {description?.split(" ").filter((tag) => tag.trim() !== "").length}
          </span>
          <span className="text-sm"> </span>
        </div>
        <div className="flex flex-col items-center">
          <MoreHoriz className="text-xl" />
        </div>
      </div>

      {/* Main Post Area */}
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
          <div className="px-12 py-4">
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
                    isSharing
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <SharingUrl url={`${homeUrl}/post/${postId}`} />
                </div>
              </div>
            </div>

            <Reactions
              postId={postId}
              initialReactions={reactions ?? [0, 0, 0, 0, 0]}
            />

            <h1 className="mb-4 text-5xl font-bold">{title}</h1>
            <div className="mb-4 flex items-center">
              <div className="flex space-x-2 text-gray-500">{description}</div>
            </div>
            <div className="prose my-12 max-w-full text-xl text-black">
              <ReactMarkdown>{body}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div
          id="comment"
          className="mt-1 w-full rounded-lg bg-white p-4 shadow-md"
        >
          <Comments postId={numericPostId} isListFilled={false} />
          <div className="mb-5 flex justify-center space-x-10">
            <span className="text-sm text-gray-500">Code of conduct</span>
            <span className="text-sm text-gray-500">Report abuse</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostContent;
