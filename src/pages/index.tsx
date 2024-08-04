import MainContent from "~/components/MainContent";
import LeftSideBar from "~/components/LeftSideBar";
import RightSideBar from "~/components/RightSideBar";

export default function Home() {
  return (
    <div className="max-w-10xl flex w-full flex-col">
      <div className="mx-0 flex min-h-screen flex-row bg-gray-100 md:mx-16">
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
  );
}
