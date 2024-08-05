import Link from "next/link";
import { FcHome } from "react-icons/fc";
import { AiOutlineRead, AiOutlineClose, AiOutlineMail } from "react-icons/ai";
import {
  FaPodcast,
  FaVideo,
  FaTags,
  FaDev,
  FaThumbsUp,
  FaUserSecret,
  FaEye,
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaTwitch,
  FaMastodon,
} from "react-icons/fa";
import { MdHelpOutline, MdShoppingCart } from "react-icons/md";
import { IoMdHeartEmpty } from "react-icons/io";
import { RiTrophyLine, RiStarLine } from "react-icons/ri";
import { GiBookshelf } from "react-icons/gi";
import { BiCodeBlock } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

const LeftSideBar = () => {
  const { data: session } = useSession();
  const { data, isLoading, isError } = api.utils.getStats.useQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading statistics!</p>;

  return (
    <div className="mt-5 rounded-lg">
      <div className="mb-4 rounded-lg bg-gray-100 bg-white p-4">
        <h2 className="text-xl font-bold">DEV Community</h2>
        <p className="mt-4 text-gray-600">
          We&apos;re a place where coders share, stay up-to-date, and grow their
          careers.
        </p>
        {session?.user && (
          <div className="button-secondary decoration-none shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Right Now !!!</h2>
            <div>
              <p>Total Users: {data?.totalUsers}</p>
              <p>Total Posts: {data?.totalPosts}</p>
              <p>Total Comments: {data?.totalComments}</p>
            </div>
          </div>
        )}
        {!session?.user && (
          <div className="mb-2 mt-4 flex flex-col space-y-1">
            <Link
              href="/signin"
              className="button-primary decoration-none shadow-lg"
            >
              Create Account
            </Link>

            <Link
              href="/signin"
              className="button-secondary decoration-none shadow-lg"
            >
              Login
            </Link>
          </div>
        )}
      </div>
      <nav>
        <ul className="space-y-1">
          <li>
            <Link href="/" className="button-secondary flex items-center">
              <span className="flex items-center">
                <FcHome size={20} className="text-blue-500" />{" "}
                <span className="mx-1">Home</span>
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/reading-list"
              className="button-secondary flex items-center"
            >
              <span className="flex items-center">
                <AiOutlineRead size={20} className="text-green-500" />{" "}
                <span className="mx-1">Reading List</span>
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/podcasts"
              className="button-secondary flex items-center"
            >
              <span className="flex items-center">
                <FaPodcast size={20} className="text-purple-500" />{" "}
                <span className="mx-1">Podcasts</span>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/videos" className="button-secondary flex items-center">
              <span className="flex items-center">
                <FaVideo size={20} className="text-red-500" />{" "}
                <span className="mx-1">Videos</span>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/tags" className="button-secondary flex items-center">
              <span className="flex items-center">
                <FaTags size={20} className="text-yellow-500" />{" "}
                <span className="mx-1">Tags</span>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/help" className="button-secondary flex items-center">
              <span className="flex items-center">
                <MdHelpOutline size={20} className="text-indigo-500" />{" "}
                <span className="mx-1">DEV Help</span>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/shop" className="button-secondary flex items-center">
              <span className="flex items-center">
                <MdShoppingCart size={20} className="text-pink-500" />{" "}
                <span className="mx-1">Forem Shop</span>
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/advertise"
              className="button-secondary flex items-center"
            >
              <span className="flex items-center">
                <IoMdHeartEmpty size={20} className="text-red-500" />{" "}
                <span className="mx-1">Advertise on DEV</span>
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/challenges"
              className="button-secondary flex items-center"
            >
              <span className="flex items-center">
                <RiTrophyLine size={20} className="text-yellow-500" />{" "}
                <span className="mx-1">DEV Challenges</span>
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/showcase"
              className="button-secondary flex items-center"
            >
              <span className="flex items-center">
                <RiStarLine size={20} className="text-teal-500" />{" "}
                <span className="mx-1">DEV Showcase</span>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/about" className="button-secondary flex items-center">
              <span className="flex items-center">
                <FaDev size={20} className="text-black" />{" "}
                <span className="mx-1">About</span>
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="button-secondary flex items-center"
            >
              <span className="flex items-center">
                <AiOutlineMail size={20} className="text-gray-500" />{" "}
                <span className="mx-1">Contact</span>
              </span>
            </Link>
          </li>
          <li>
            <Link href="/guides" className="button-secondary flex items-center">
              <span className="flex items-center">
                <GiBookshelf size={20} className="text-blue-500" />{" "}
                <span className="mx-1">Guides</span>
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/comparisons"
              className="button-secondary flex items-center"
            >
              <span className="flex items-center">
                <BiCodeBlock size={20} className="text-orange-500" />{" "}
                <span className="mx-1">Software comparisons</span>
              </span>
            </Link>
          </li>
        </ul>

        <div className="ml-5 mt-6 font-bold">Others</div>
        <ul className="space-y-1">
          <li>
            <Link
              href="/code-of-conduct"
              className="button-secondary flex items-center"
            >
              <span className="flex items-center">
                <FaThumbsUp size={20} className="text-yellow-300" />
                <span className="mx-1">Code of Conduct</span>
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/privacy-policy"
              className="button-secondary flex items-center"
            >
              <span className="flex items-center">
                <FaUserSecret size={20} className="text-yellow-500" />
                <span className="mx-1">Privacy Policy</span>
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/terms-of-use"
              className="button-secondary flex items-center"
            >
              <span className="flex items-center">
                <FaEye size={20} className="" />
                <span className="mx-1">Terms of Use</span>
              </span>
            </Link>
          </li>
        </ul>

        <div className="p-4">
          {/* Social Media Icons */}
          <div className="mb-6 flex space-x-4">
            <AiOutlineClose className="text-xl text-gray-700" />
            <FaFacebookF className="text-xl text-gray-700" />
            <FaGithub className="text-xl text-gray-700" />
            <FaInstagram className="text-xl text-gray-700" />
            <FaTwitch className="text-xl text-gray-700" />
            <FaMastodon className="text-xl text-gray-700" />
          </div>

          {/* My Tags Section */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">My Tags</h3>
            <FiSettings className="text-xl text-gray-700" />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default LeftSideBar;
