import { useState } from "react";
import { api } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Comment from "./Comment";

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
    <div className="comments-section">
      <div className="top-bar flex justify-between text-2xl font-bold">
        <h1>Top comments ({comments?.length ?? 0})</h1>
      </div>

      <div className="add-comment my-4 flex items-center">
        <Link href={`/user/${session?.user.id}`}>
          <Image
            src={session?.user.image ?? defaultProfileImage}
            alt="User Avatar"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full"
          />
        </Link>
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
        {comments
          ?.slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map((comment) => <Comment key={comment.id} comment={comment} />)}
      </div>
    </div>
  );
};

export default Comments;
