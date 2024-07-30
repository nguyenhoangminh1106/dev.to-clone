import React from "react";
import Image from "next/image";

const RightSideBar = () => {
  return (
    <div className="mt-5 rounded-lg bg-white p-4 shadow-md">
      <div>
        <h2 className="mb-4 text-xl font-bold">About Me</h2>
        <Image
          src="/images/my_photo.jpg"
          width={500}
          height={500}
          alt="Profile Picture"
          className="mx-auto h-24 w-24 rounded-full"
        />
        <p className="mt-4 text-gray-700">
          Hi, I'm Minh! I'm passionate about SWE, Cloud, Cyber Security. I love
          working on projects that involve new technologies.
        </p>
        <p className="mt-2 text-gray-700">
          In my free time, I enjoy playing chess and watching films. Feel free
          to connect with me!
        </p>
        <div className="mt-4 flex justify-around">
          <a
            href="https://github.com/nguyenhoangminh1106"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/github.png"
              alt="GitHub"
              width={500}
              height={500}
              className="h-6 w-6"
            />
          </a>
          <a
            href="https://www.linkedin.com/in/minh-nguyen-521998276/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/linkedin.png"
              width={500}
              height={500}
              alt="LinkedIn"
              className="h-6 w-6"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
