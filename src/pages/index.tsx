import MainContent from "~/components/MainContent";
import LeftSideBar from "~/components/LeftSideBar";
import RightSideBar from "~/components/RightSideBar";

/**
 * HOME PAGE
 * @returns
 */
export default function Home() {
  return (
    <div className="flex w-full max-w-10xl flex-col">
      <div className="mx-0 flex min-h-screen flex-row bg-gray-100 md:space-x-2 xl:mx-20">
        <div className="basis-2/12 max-md:hidden">
          <LeftSideBar />
        </div>

        <div className="basis-full lg:basis-7/12">
          <MainContent />
        </div>

        <div className="basis-3/12 max-lg:hidden">
          <RightSideBar />
        </div>
      </div>
    </div>
  );
}
