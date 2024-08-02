// PostList.tsx
import React from "react";
import Post from "~/components/Post";
import type { Post as PostType } from "@prisma/client";

interface PostListProps {
  posts: PostType[];
  refetch: () => void;
}

const PostList: React.FC<PostListProps> = ({ posts, refetch }) => {
  const sortedPosts = posts
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <div className="mt-6 w-full max-w-3xl">
      <h2 className="text-xl font-bold">Posts</h2>
      {sortedPosts.length > 0 ? (
        sortedPosts.map((post) => (
          <Post key={post.id} post={post} refetch={refetch} />
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default PostList;
