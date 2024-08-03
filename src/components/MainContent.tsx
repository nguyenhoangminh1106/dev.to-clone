import { api } from "~/utils/api";
import PostList from "./PostList";
import Image from "next/image";
import { useRouter } from "next/router";

import type { ParsedUrlQuery } from "querystring";

const MainContent = () => {
  const router = useRouter();
  const { query } = (router.query as ParsedUrlQuery & { query: string }) ?? "";

  const websiteLogo =
    "https://lyra-trial-1106.s3.ap-southeast-2.amazonaws.com/default/OIP.jfif";

  const {
    data: posts,
    isLoading,
    isError,
    refetch,
  } = api.post.getPublishedPosts.useQuery({ query });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading posts</p>;

  return (
    <main className="mt-4 flex-grow sm:mt-7">
      <div className="mb-4">
        {!query && (
          <>
            <div className="mb-4 ml-5 flex items-center space-x-4">
              <h2 className="text-lg font-bold text-black">Relevant</h2>
              <p className="cursor-pointer text-gray-500 hover:text-black">
                Latest
              </p>
              <p className="cursor-pointer text-gray-500 hover:text-black">
                Top
              </p>
            </div>

            <div className="mx-1 rounded-lg bg-white p-6 shadow-md sm:mx-0 sm:mx-2 md:mx-5">
              <p className="mb-4">👋 DEV Challenges</p>
              <div className="mx-1 sm:mx-10">
                <h1 className="mb-2 text-2xl font-semibold">
                  DEV Challenge are Live 🚀
                </h1>
                <h2 className="mb-4 text-xl font-bold">
                  The latest edition Frontend Challenge just launched
                </h2>

                <div className="mb-4">
                  <div className="rounded-md border border-gray-300 bg-white p-4 shadow-md">
                    <div className="mb-2 flex items-center">
                      <Image
                        src={websiteLogo}
                        alt="DEV"
                        width={500}
                        height={500}
                        className="mr-3 h-10 w-10"
                      />
                      <div>
                        <h3 className="text-xl font-bold">
                          Join us for the next Frontend Challenge: Recreation
                          Edition
                        </h3>
                        <p className="text-sm font-semibold text-gray-500">
                          dev.to staff for The DEV Team · Jul 24
                        </p>
                        <div className="text-sm text-gray-500">
                          #devchallenge #frontendchallenge #css #javascript
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Challenge 2 */}
                <h2 className="mb-4 text-xl font-bold">
                  The Stellar Challenge with 50k in prizes is still live!
                </h2>
                <div className="mb-4">
                  <div className="rounded-md border border-gray-300 bg-white p-4 shadow-md">
                    <div className="mb-2 flex items-center">
                      <Image
                        src={websiteLogo}
                        alt="DEV"
                        width={500}
                        height={500}
                        className="mr-3 h-10 w-10"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">
                          Join Us For The First Community Smart Contract
                          Challenge With $50,000 In Prizes!
                        </h3>
                        <p className="text-sm font-semibold text-gray-500">
                          dev.to staff for The DEV Team · Jul 10
                        </p>
                        <div className="text-sm text-gray-500">
                          #devchallenge #stellarchallenge #web3 #blockchain
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <p className="mt-4">Happy coding ❤️</p>
              </div>
            </div>
          </>
        )}

        {query && (
          <div className="mb-4 ml-5 flex items-center space-x-4 text-2xl font-bold">
            <i>Search result for: &quot;{query}&quot;</i>
          </div>
        )}

        <div className="flex justify-center space-y-4">
          <PostList
            showCommentLists={true}
            posts={posts ?? []}
            refetch={refetch}
          />
        </div>
      </div>
    </main>
  );
};

export default MainContent;
