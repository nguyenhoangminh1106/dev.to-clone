import { useState } from "react";
import { api } from "~/utils/api";
import Image from "next/image";
import { useSession } from "next-auth/react";

const Comments = ({ postId }: { postId: number }) => {
  const [comment, setComment] = useState("");
  const { data: comments, refetch } = api.comment.getByPostId.useQuery({
    postId,
  });

  const defaultProfileImage =
    "https://lyra-trial-1106.s3.ap-southeast-2.amazonaws.com/profileImage/6yvpkj.jpg";

  const { data: session } = useSession();

  const addCommentMutation = api.comment.add.useMutation();

  const handleAddComment = async () => {
    await addCommentMutation.mutateAsync({ postId, content: comment });
    setComment("");
    refetch(); // Refresh the comments list
  };

  return (
    <div className="comments-section">
      <div className="top-bar flex justify-between">
        <h1>Top comments ({comments?.length || 0})</h1>
      </div>

      <div className="add-comment my-4 flex items-center">
        <Image
          src={session?.user.image || defaultProfileImage}
          alt="User Avatar"
          width={40}
          height={40}
          className="h-10 w-10 rounded-full"
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add to the discussion"
          className="ml-4 flex-grow rounded border p-2"
        />
        <button onClick={handleAddComment} className="button-secondary">
          Submit
        </button>
      </div>

      <div className="comments-list mt-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="comment-item mt-4 border-t pt-4">
            <div className="flex items-center">
              <Image
                src={comment.author.image || "/default-avatar.png"}
                alt="Avatar"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full"
              />
              <div className="ml-3">
                <p className="font-semibold">{comment.author.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>
            <p className="mt-2">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
