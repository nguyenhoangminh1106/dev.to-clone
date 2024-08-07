import { api } from "~/utils/api";
import PostList from "./PostList";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { FiChevronRight } from "react-icons/fi";

import type { ParsedUrlQuery } from "querystring";
import Link from "next/link";
import LoadingBar from "./LoadingBar";

/**
 * THE MIDDLE COLUMN OF THE WEBPAGE
 * @returns
 */
const MainContent = () => {
  const router = useRouter();
  const { data: session } = useSession();

  // Convert query to string
  const { query } = (router.query as ParsedUrlQuery & { query: string }) ?? "";

  const websiteLogo =
    "https://lyra-trial-1106.s3.ap-southeast-2.amazonaws.com/default/OIP.jfif";

  // Add post to database
  const {
    data: posts,
    isLoading,
    isError,
    refetch,
  } = api.post.getPublishedPosts.useQuery({ query });

  return (
    <>
      {isLoading && <LoadingBar />}
      {isError && <p className="m-5 text-red-500">Error loading posts</p>}
      <main className="mt-2 flex-grow md:mr-2 lg:mx-2">
        <div className="my-5">
          {/* If not searching and already signed in */}
          {session?.user && !query && (
            <div className="mb-4 hidden rounded-lg bg-indigo-600 px-24 py-10 shadow-md lg:block">
              <div className="flex items-start justify-between">
                <Image
                  src="/images/dev.png"
                  alt="DEV Logo"
                  width={50}
                  height={50}
                  className="h-24 w-24 rounded-2xl"
                />
                <button className="text-2xl text-white">&times;</button>{" "}
                {/* Close Button */}
              </div>
              <h1 className="mt-4 text-4xl font-bold text-white">
                You&apos;re now a part of the community!
              </h1>
              <p className="mt-2 text-sm font-semibold uppercase text-slate-300">
                Suggested things you can do
              </p>
              <ul className="mt-4 space-y-3 text-white">
                <li className="flex cursor-pointer items-center justify-between rounded-lg bg-indigo-50/50 p-3 text-sm font-semibold hover:bg-indigo-700">
                  <span className="flex items-center space-x-2">
                    <span role="img" aria-label="smiley">
                      😊
                    </span>
                    <span>Join the Welcome thread</span>
                  </span>
                  <FiChevronRight className="text-white" />
                </li>
                <Link
                  href="/createPost"
                  className="flex cursor-pointer items-center justify-between rounded-lg bg-indigo-50/50 p-3 text-sm font-semibold hover:bg-indigo-700"
                >
                  <span className="flex items-center space-x-2">
                    <span role="img" aria-label="write">
                      ✍️
                    </span>
                    <span>Write your first DEV Community post</span>
                  </span>
                  <FiChevronRight className="text-white" />
                </Link>
                <Link
                  href="/setting"
                  className="flex cursor-pointer items-center justify-between rounded-lg bg-indigo-50/50 p-3 text-sm font-semibold hover:bg-indigo-700"
                >
                  <span className="flex items-center space-x-2">
                    <span role="img" aria-label="customize">
                      ✨
                    </span>
                    <span>Customize your profile</span>
                  </span>
                  <FiChevronRight className="text-white" />
                </Link>
              </ul>
            </div>
          )}

          {/* If not signed in */}
          {!query && (
            <>
              <div className="mb-2 ml-2 flex items-center space-x-4">
                <h2 className="rounded-lg p-2 text-lg font-bold text-black hover:bg-white hover:text-indigo-600">
                  Relevant
                </h2>
                <p className="cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-white hover:text-black hover:text-indigo-600">
                  Latest
                </p>
                <p className="cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-white hover:text-black hover:text-indigo-600">
                  Top
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
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

          {/* When display search result */}
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
              showHeaderLists={true}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default MainContent;
