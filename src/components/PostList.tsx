// PostList.tsx
import React from "react";
import Post from "~/components/Post";
import { PostType } from "~/types"; // Import your PostType definition

interface PostListProps {
  posts: PostType[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
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
        sortedPosts.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default PostList;
