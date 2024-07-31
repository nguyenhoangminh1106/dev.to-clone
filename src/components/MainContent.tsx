import Link from "next/link";
import { api } from "~/utils/api";
import Image from "next/image";

const MainContent = () => {
  const { data: posts, isLoading, isError } = api.post.getPosts.useQuery();
  const default_profile_image =
    "https://lyra-trial-1106.s3.ap-southeast-2.amazonaws.com/profileImage/6yvpkj.jpg";

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading posts</p>;

  return (
    <main className="mt-5 flex-grow p-2">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Relevant</h2>
        <div className="mt-4 space-y-4">
          {posts
            ?.slice(0)
            .reverse()
            .map((post) => (
              <Link key={post.id} href="/post_body" className="">
                <div className="my-4">
                  <div className="rounded-lg bg-white p-4 shadow">
                    <div className="mb-4 flex items-center">
                      <Image
                        src={
                          post.createdBy.profileImage ?? default_profile_image
                        }
                        alt="Profile Image"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="ml-3">
                        <p className="font-semibold">{post.createdBy.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString("en-GB")}
                        </p>
                      </div>
                    </div>

                    <h1 className="mx-6 mt-2 text-3xl font-bold">
                      {post.title}
                    </h1>
                    <p className="mx-6 mt-2 text-gray-700">
                      {post.description}
                    </p>

                    {post.coverImage && (
                      <Image
                        src={post.coverImage}
                        alt="Cover"
                        width={500}
                        height={300}
                        className="mx-auto my-6 rounded-lg object-cover"
                      />
                    )}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
};

export default MainContent;
