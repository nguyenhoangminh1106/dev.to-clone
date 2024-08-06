import React, { useState } from "react";
import { api } from "~/utils/api";

const Reactions = ({
  postId,
  initialReactions,
}: {
  postId: number;
  initialReactions: number[];
}) => {
  const [reactions, setReactions] = useState(initialReactions);
  const numericPostId = typeof postId === "string" ? parseInt(postId, 10) : NaN;

  const addReaction = api.post.updateReaction.useMutation();

  const handleReactionClick = async (index: number) => {
    const updatedReactions = reactions.map((count, i) =>
      i === index ? count + 1 : count,
    );

    try {
      console.log("Updating reactions...");
      await addReaction.mutateAsync({ postId: numericPostId, index });
      setReactions(updatedReactions);
    } catch (error) {
      console.error("Error updating reaction:", error);
      setReactions(initialReactions);
    }
  };

  const emojis = ["❤️", "🦄", "🤯", "🙏", "🔥"];

  return (
    <div className="flex space-x-12 py-1">
      {reactions.map((count, index) => (
        <div
          key={index}
          className="flex cursor-pointer items-center space-x-1 rounded-lg p-1 text-lg hover:bg-gray-100"
          onClick={() => handleReactionClick(index)}
        >
          <span>{emojis[index]}</span>
          <span>{count}</span>
        </div>
      ))}
    </div>
  );
};

export default Reactions;
