import PostSideBar from "~/components/PostSideBar";
import PostContent from "~/components/PostContent";

const Post = () => {
  return (
    <div className="mx-0 flex flex-wrap bg-gray-100 md:ml-4 xl:ml-6 xl:mr-4">
      <div className="w-full sm:px-2 md:pt-1 lg:w-2/3 lg:pl-20 lg:pt-4">
        <PostContent />
      </div>
      <div className="w-full pt-12 sm:ml-12 sm:px-2 lg:ml-0 lg:w-1/3 lg:pr-20 lg:pt-4">
        <PostSideBar />
      </div>
    </div>
  );
};

export default Post;
