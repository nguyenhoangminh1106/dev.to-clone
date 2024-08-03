import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

const SignUp = () => {
  const websiteLogo =
    "https://lyra-trial-1106.s3.ap-southeast-2.amazonaws.com/default/OIP.jfif";

  const handleSignUpGitHub = async () => {
    await signIn("github");
  };

  const handleSignUpGoogle = async () => {
    await signIn("google");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Image
        src={websiteLogo}
        alt="DEV"
        width={500}
        height={500}
        className="mb-5 mr-3 h-12 w-16"
      />
      <h1 className="text-3xl font-bold">Join the DEV Community</h1>
      <p className="mb-4 text-gray-700">
        DEV Community is a community of amazing developers
      </p>
      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={handleSignUpGitHub}
          className="flex w-full items-center justify-center rounded-lg bg-black px-4 py-2 text-white"
        >
          <i className="fab fa-github mr-2"></i>
          Sign up with GitHub
        </button>
        <button
          onClick={handleSignUpGoogle}
          className="flex w-full items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-white"
        >
          <i className="fab fa-google mr-2"></i>
          Sign up with Google
        </button>
      </div>
      <p className="mt-4">
        Already have an account?{" "}
        <Link href="/signin" className="text-indigo-700">
          Log in.
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
