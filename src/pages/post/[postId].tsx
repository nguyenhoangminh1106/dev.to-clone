import BackButton from "~/components/BackButton";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import NavBar from "~/components/NavBar";
import PostComment from "~/components/PostComment";
import PostContent from "~/components/PostContent";

const Post = () => {
  return (
    <>
      <Header />
      <NavBar />
      <BackButton />
      <div className="flex flex-wrap">
        <div className="w-full p-4 md:w-2/3">
          <PostContent />
        </div>
        <div className="w-fullp-4 md:w-1/3">
          <div className="rounded-lg bg-white p-4 shadow">
            <PostComment />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Post;
