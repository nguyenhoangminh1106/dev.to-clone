import { api } from "~/utils/api";
import Post from "./Post";

const MainContent = () => {
  const {
    data: posts,
    isLoading,
    isError,
  } = api.post.getPublishedPosts.useQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading posts</p>;

  return (
    <main className="mt-5 flex-grow p-2">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Relevant</h2>
        <div className="mt-4 space-y-4">
          {posts
            ?.slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((post) => (
              <Post
                key={post.id}
                post={{
                  ...post,
                  createdBy: {
                    ...post.createdBy,
                    profileImage: post.createdBy.image,
                  },
                }}
              />
            ))}
        </div>
      </div>
    </main>
  );
};

export default MainContent;
