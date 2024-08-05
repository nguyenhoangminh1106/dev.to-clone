import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-100 p-4 pt-5 text-center">
      <p>
        Thank you <i>Nam Dao</i> and the{" "}
        <Link
          href="https://www.lyratechnologies.com.au/"
          className="text-blue-600"
          target="_blank"
        >
          Lyra Technologies
        </Link>{" "}
        team. This website was built for the Lyra Trial.
      </p>
      <div className="text-sm text-gray-600">
        <Link href="/" className="mx-2">
          Home
        </Link>{" "}
        •
        <Link href="#" className="mx-2">
          Tags
        </Link>{" "}
        •
        <Link href="#" className="mx-2">
          About
        </Link>{" "}
        •
        <Link href="#" className="mx-2">
          Contact
        </Link>{" "}
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Built using{" "}
        <Link
          href="https://github.com/t3-oss/create-t3-app"
          className="text-blue-600"
          target="_blank"
        >
          T3 Stack
        </Link>{" "}
        — a CLI built by seasoned T3 Stack devs to streamline the setup of a
        modular T3 Stack app.
      </p>
      <p className="text-xs text-gray-500">
        Deployed using{" "}
        <Link
          href="https://railway.app/"
          target="_blank"
          className="text-blue-600"
        >
          Railway
        </Link>
        ,{" "}
        <Link
          href="https://aws.amazon.com/"
          target="_blank"
          className="text-blue-600"
        >
          AWS
        </Link>
        , and{" "}
        <Link
          href="https://vercel.com/"
          target="_blank"
          className="text-blue-600"
        >
          Vercel
        </Link>
        . Minh Nguyen © 2024.
      </p>
    </footer>
  );
};

export default Footer;
