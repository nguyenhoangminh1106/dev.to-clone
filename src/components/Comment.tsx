import Image from "next/image";
import Link from "next/link";
import type { Comment } from "@prisma/client"; // Importing the Comment type from Prisma

/**
 * Include autho info for Comment Type
 */
interface CommentProps {
  comment: Comment & {
    author: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
}

/**
 * Display each comment
 *
 * @param comment
 * @returns
 */
const CommentComponent = ({
  comment,
  isFilled,
}: {
  comment: CommentProps["comment"];
  isFilled: boolean;
}) => {
  return (
    <div className="comment-item mt-4">
      <div className="flex items-center">
        {/* Author image */}
        <Link href={`/user/${comment.author.id}`}>
          <Image
            src={comment.author.image ?? "/default-avatar.png"}
            alt="Avatar"
            width={40}
            height={40}
            className="h-6 w-6 rounded-full"
          />
        </Link>

        {/* Author info */}
        <div
          className={`ml-3 w-full rounded-lg ${isFilled ? "bg-gray-100" : "border border-gray-100"} p-2`}
        >
          <div className="flex items-center space-x-2">
            <p className="px-1 font-semibold hover:bg-gray-100">
              {comment.author.name ?? "Unknown"}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
          <p className="mt-1 text-sm">{comment.content}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentComponent;
