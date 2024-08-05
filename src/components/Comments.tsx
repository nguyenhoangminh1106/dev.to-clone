import { useState } from "react";
import { api } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Comment from "./Comment";

/**
 * DISPLAY A LIST OF COMMENTS OF A POST
 * @param postId
 * @returns
 */
const Comments = ({
  postId,
  isListFilled,
}: {
  postId: number;
  isListFilled: boolean;
}) => {
  const [comment, setComment] = useState("");
  const { data: comments, refetch } = api.comment.getByPostId.useQuery({
    postId,
  });

  const defaultProfileImage =
    "https://lyra-trial-1106.s3.ap-southeast-2.amazonaws.com/profileImage/6yvpkj.jpg";

  const { data: session } = useSession();

  const addCommentMutation = api.comment.add.useMutation();

  // Add comment
  const handleAddComment = async () => {
    try {
      await addCommentMutation.mutateAsync({ postId, content: comment });
      setComment("");
      try {
        await refetch();
      } catch (error) {
        console.log("Refetch unsuccessfully: ", error);
      }
    } catch (error) {
      console.log("Error adding comment: ", error);
    }
  };

  return (
    <div className="comments-section p-10">
      <div className="top-bar text-md flex items-center justify-between">
        {/* Number of comments */}
        <h1 className="text-2xl font-bold">
          Top comments ({comments?.length ?? 0})
        </h1>
        <button
          onClick={handleAddComment}
          className="button-secondary border-2 border-gray-300"
        >
          Add comment
        </button>
      </div>

      {/* Comment form */}
      <div className="add-comment my-4 flex items-center">
        {/* User image */}
        <Link href={`/user/${session?.user.id}`}>
          <Image
            src={session?.user.image ?? defaultProfileImage}
            alt="User Avatar"
            width={40}
            height={40}
            className="h-8 w-8 rounded-full"
          />
        </Link>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add to the discussion"
          className="hover:border-3 ml-3 flex-grow rounded border border-gray-400 p-2 hover:border-indigo-700"
        />
      </div>

      {/* List all the comments */}
      <div className="comments-list mt-4">
        {comments
          ?.slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              isFilled={isListFilled}
            />
          ))}
      </div>
    </div>
  );
};

export default Comments;
