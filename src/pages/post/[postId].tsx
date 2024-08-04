import PostSideBar from "~/components/PostSideBar";
import PostContent from "~/components/PostContent";

const Post = () => {
  return (
    <div className="flex flex-wrap bg-gray-100">
      <div className="w-full px-2 pt-4 lg:w-2/3 lg:pl-20">
        <PostContent />
      </div>
      <div className="w-full px-2 pt-12 lg:w-1/3 lg:pr-20 lg:pt-4">
        <PostSideBar />
      </div>
    </div>
  );
};

export default Post;
