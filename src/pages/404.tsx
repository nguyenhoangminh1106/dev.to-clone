import Link from "next/link";
import Image from "next/image";

const NotFoundPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center">
        <Image
          className="h-80 w-80 rounded-3xl bg-indigo-900 p-5"
          alt="404 Page"
          width={500}
          height={500}
          src="/images/404.jpg"
        ></Image>
        <p className="my-8 text-xl">This page does not exist</p>

        <Link href="/" className="text-xl text-indigo-900 underline">
          Return to Home Page
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
