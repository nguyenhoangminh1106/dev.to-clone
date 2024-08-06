import React from "react";
import Post from "~/components/Post";
import type { Post as PostType } from "@prisma/client";

/**
 * DISPLAY THE LIST OF POSTS
 * @param param0
 * @returns
 */
const PostList = ({
  posts,
  refetch,
  showCommentLists, // Whether each post in the list will display comments
  showHeaderLists,
}: {
  posts: PostType[];
  refetch: () => void;
  showCommentLists: boolean;
  showHeaderLists: boolean;
}) => {
  const sortedPosts = posts
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <div className="w-full">
      {/* Sort posts from the latest */}
      {sortedPosts.length > 0 ? (
        sortedPosts.map((post) => (
          <Post
            key={post.id}
            post={post}
            refetch={refetch}
            showComments={showCommentLists}
            showHeader={showHeaderLists}
          />
        ))
      ) : (
        <p className="my-5 text-gray-500">No posts available</p>
      )}
    </div>
  );
};

export default PostList;
