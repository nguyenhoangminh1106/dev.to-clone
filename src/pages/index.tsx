import Header from "~/components/Header";
import NavBar from "~/components/NavBar";
import MainContent from "~/components/MainContent";
import LeftSideBar from "~/components/LeftSideBar";
import RightSideBar from "~/components/RightSideBar";

export default function Home() {
  return (
    <>
      <Header />
      <div className="bg-gray-100">
        <NavBar />
        <div className="mx-2 flex min-h-screen flex-row bg-gray-100 sm:mx-2 md:mx-12">
          <div className="basis-2/12 max-sm:hidden">
            <LeftSideBar />
          </div>

          <div className="basis-full md:basis-7/12">
            <MainContent />
          </div>

          <div className="basis-3/12 max-md:hidden">
            <RightSideBar />
          </div>
        </div>
      </div>
    </>
  );
}
