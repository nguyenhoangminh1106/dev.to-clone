import { api } from "~/utils/api";
import PostList from "./PostList";
import { useRouter } from "next/router";

import type { ParsedUrlQuery } from "querystring";

const MainContent = () => {
  const router = useRouter();
  const { query } = (router.query as ParsedUrlQuery & { query: string }) ?? "";

  const {
    data: posts,
    isLoading,
    isError,
    refetch,
  } = api.post.getPublishedPosts.useQuery({ query });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading posts</p>;

  return (
    <main className="mt-5 flex-grow p-2">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Relevant</h2>
        <p>{query && <i>Search result for: &quot;{query}&quot;</i>}</p>
        <div className="mt-4 space-y-4">
          <PostList posts={posts ?? []} refetch={refetch} />
        </div>
      </div>
    </main>
  );
};

export default MainContent;
