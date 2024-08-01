import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Post from "./Post";

const MainContent = () => {
  const router = useRouter();

  const deletePost = api.post.deletePost.useMutation();
  const hidePost = api.post.hidePost.useMutation();
  const {
    data: posts,
    isLoading,
    isError,
  } = api.post.getPublishedPosts.useQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading posts</p>;

  const handleEdit = (postId: number) => {
    router.push(`/editPost/${postId}`);
  };

  const handleDelete = async (postId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );
    if (!confirmed) return;

    try {
      await deletePost.mutateAsync({ postId });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleHide = async (postId: number) => {
    try {
      await hidePost.mutateAsync({ postId });
      window.location.reload();
    } catch (error) {
      console.error("Error hiding post:", error);
    }
  };

  return (
    <main className="mt-5 flex-grow p-2">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Relevant</h2>
        <div className="mt-4 space-y-4">
          {posts
            ?.slice(0)
            .reverse()
            .map((post) => (
              <Post
                key={post.id}
                post={post}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onHide={handleHide}
              />
            ))}
        </div>
      </div>
    </main>
  );
};

export default MainContent;
