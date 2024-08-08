import React from "react";
import Image from "next/image";
import PostList from "./PostList";
import { api } from "~/utils/api";

/**
 * RIGHT SIDE BAR IN THE HOME PAGE
 * @returns
 */
const RightSideBar = () => {
  const {
    data: posts,
    isError,
    refetch,
  } = api.post.getPublishedPosts.useQuery({ filter: "comment", count: 8 });

  return (
    <>
      {isError && <p className="m-5 text-red-500">Error loading posts</p>}

      <div className="mt-5 rounded-md bg-white p-4">
        <h2 className="text-xl font-bold">Active discussions</h2>
        <PostList
          showCommentLists={false}
          posts={posts ?? []}
          refetch={refetch}
          showHeaderLists={false}
        />
      </div>
      <div className="mt-3 w-full rounded-md border bg-white p-4">
        <h2 className="mb-2 text-lg font-semibold">
          👋 What&apos;s happening this week
        </h2>
        <h3 className="text-md mb-2 font-bold">Challenges 🤗</h3>

        <div className="mb-4 rounded-md border border-2 border-black p-2">
          <p>Running until August 18</p>
          <a
            href="#"
            className="font-semibold text-blue-600 underline hover:text-indigo-700"
          >
            Build Better on Stellar: Smart Contract Challenge
          </a>
          <p>50k in prizes!</p>
        </div>

        <div className="mb-4 rounded-md border border-2 border-black p-2">
          <p>Running until August 4</p>
          <a
            href="#"
            className="font-semibold text-blue-600 underline hover:text-indigo-700"
          >
            Frontend Challenge: Recreation Edition
          </a>
          <p>Claim your next badge</p>
        </div>

        <p>Have a great week ❤️</p>
      </div>
      <div className="mt-3 rounded-md bg-white p-4">
        <h2 className="text-xl font-bold">#discuss</h2>
        <p className="mb-4 text-sm text-gray-600">
          Discussion threads targeting the whole community
        </p>
        <ul>
          <li className="border-b py-4">
            <p className="text-md text-gray-500 hover:text-indigo-700">
              I&apos;m developing a minimalistic note-taking web app with custom
              widgets. Can you suggest any widgets you would like to see?
            </p>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <span>1 comment</span>
            </div>
          </li>
          <li className="border-b py-4">
            <p className="text-md text-gray-500 hover:text-indigo-700">
              Difference between RPM based and Debian based.
            </p>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <span className="mr-2 rounded-full bg-yellow-300 px-1 py-0.5 text-xs text-yellow-800">
                New
              </span>
              <span>No comments</span>
            </div>
          </li>
          <li className="border-b py-4">
            <p className="text-md text-gray-500 hover:text-indigo-700">
              You&apos;re faced with conflicting team members. How do you
              navigate a resolution between them?
            </p>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <span>2 comments</span>
            </div>
          </li>
          <li className="border-b py-4">
            <p className="text-md text-gray-500 hover:text-indigo-700">
              You&apos;re facing a challenging client situation. How can you
              prioritize your team&apos;s well-being?
            </p>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <span className="mr-2 rounded-full bg-yellow-300 px-1 py-0.5 text-xs text-yellow-800">
                New
              </span>
            </div>
          </li>
          <li className="border-b py-4">
            <p className="text-md text-gray-500 hover:text-indigo-700">
              New Gigs?
            </p>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <span>2 comments</span>
            </div>
          </li>
        </ul>
      </div>
      <div className="mt-3 rounded-md bg-white p-4">
        <div>
          <h2 className="mb-4 text-xl font-bold">About Me</h2>
          <Image
            src="/images/my_photo.jpg"
            width={500}
            height={500}
            alt="Profile Picture"
            className="mx-auto h-24 w-24 rounded-full"
          />
          <p className="mt-4 text-gray-700">
            {`Hi, I'm Minh! I'm passionate about SWE, Cloud, Cyber Security. I love
          working on projects that involve new technologies.`}
          </p>
          <p className="mt-2 text-gray-700">
            In my free time, I enjoy playing chess and watching films. Feel free
            to connect with me!
          </p>
          <div className="mt-4 flex justify-around">
            <a
              href="https://github.com/nguyenhoangminh1106"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/images/github.png"
                alt="GitHub"
                width={500}
                height={500}
                className="h-6 w-6"
              />
            </a>
            <a
              href="https://www.linkedin.com/in/minh-nguyen-521998276/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/images/linkedin.png"
                width={500}
                height={500}
                alt="LinkedIn"
                className="h-6 w-6"
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSideBar;
