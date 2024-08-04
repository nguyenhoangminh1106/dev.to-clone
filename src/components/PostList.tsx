// PostList.tsx
import React from "react";
import Post from "~/components/Post";
import type { Post as PostType } from "@prisma/client";

const PostList = ({
  posts,
  refetch,
  showCommentLists,
}: {
  posts: PostType[];
  refetch: () => void;
  showCommentLists: boolean;
}) => {
  const sortedPosts = posts
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <div className="mx-1 w-full">
      {sortedPosts.length > 0 ? (
        sortedPosts.map((post) => (
          <Post
            key={post.id}
            post={post}
            refetch={refetch}
            showComments={showCommentLists}
          />
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default PostList;
