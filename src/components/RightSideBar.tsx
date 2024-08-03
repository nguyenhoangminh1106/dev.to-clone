import React from "react";
import Image from "next/image";

const RightSideBar = () => {
  return (
    <>
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
            {`Hi, I'm Minh! I'm passionate about SWE, Cloud, Cyber Security. I love
          working on projects that involve new technologies.`}
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

      <div className="mt-3 w-full rounded-md border bg-white p-4">
        <h2 className="mb-2 text-lg font-semibold">
          👋 What's happening this week
        </h2>
        <h3 className="text-md mb-2 font-bold">Challenges 🤗</h3>

        <div className="mb-4 rounded-md border p-2">
          <p>Running until August 18</p>
          <a href="#" className="font-semibold text-blue-600">
            Build Better on Stellar: Smart Contract Challenge
          </a>
          <p>50k in prizes!</p>
        </div>

        <div className="mb-4 rounded-md border p-2">
          <p>Running until August 4</p>
          <a href="#" className="font-semibold text-blue-600">
            Frontend Challenge: Recreation Edition
          </a>
          <p>Claim your next badge</p>
        </div>

        <p>Have a great week ❤️</p>
      </div>
    </>
  );
};

export default RightSideBar;
