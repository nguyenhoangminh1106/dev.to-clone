import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-300 bg-gray-100 p-4 text-center">
      <p>
        Thank you <i>Nam Dao</i> and the{" "}
        <a
          href="https://www.lyratechnologies.com.au/"
          className="text-blue-600"
          target="_blank"
        >
          Lyra Technologies
        </a>{" "}
        team. This website was built for the Lyra Trial.
      </p>
      <div className="text-sm text-gray-600">
        <a href="/" className="mx-2">
          Home
        </a>{" "}
        •
        <a href="#" className="mx-2">
          Tags
        </a>{" "}
        •
        <a href="#" className="mx-2">
          About
        </a>{" "}
        •
        <a href="#" className="mx-2">
          Contact
        </a>{" "}
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Built using{" "}
        <a
          href="https://github.com/t3-oss/create-t3-app"
          className="text-blue-600"
          target="_blank"
        >
          T3 Stack
        </a>{" "}
        — a CLI built by seasoned T3 Stack devs to streamline the setup of a
        modular T3 Stack app.
      </p>
      <p className="text-xs text-gray-500">
        Deployed using{" "}
        <a
          href="https://railway.app/"
          target="_blank"
          className="text-blue-600"
        >
          Railway
        </a>
        ,{" "}
        <a
          href="https://aws.amazon.com/"
          target="_blank"
          className="text-blue-600"
        >
          AWS
        </a>
        , and{" "}
        <a href="https://vercel.com/" target="_blank" className="text-blue-600">
          Vercel
        </a>
        . Minh Nguyen © 2024.
      </p>
    </footer>
  );
};

export default Footer;
