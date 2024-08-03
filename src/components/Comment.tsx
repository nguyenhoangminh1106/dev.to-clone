import Image from "next/image";
import Link from "next/link";
import type { Comment } from "@prisma/client"; // Importing the Comment type from Prisma

interface CommentProps {
  comment: Comment & {
    author: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
}

const CommentComponent = ({ comment }: CommentProps) => {
  return (
    <div className="comment-item mt-4">
      <div className="flex items-center">
        <Link href={`/user/${comment.author.id}`}>
          <Image
            src={comment.author.image ?? "/default-avatar.png"}
            alt="Avatar"
            width={40}
            height={40}
            className="h-8 w-8 rounded-full"
          />
        </Link>
        <div className="ml-3 w-full rounded-lg bg-gray-100 p-1">
          <div className="flex items-center space-x-2">
            <p className="font-semibold">{comment.author.name ?? "Unknown"}</p>
            <p className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString("en-GB")}
            </p>
          </div>
          <p className="mt-1">{comment.content}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentComponent;
