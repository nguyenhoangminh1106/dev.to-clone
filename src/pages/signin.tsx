import { signIn } from "next-auth/react";
import Link from "next/link";
import BackButton from "~/components/BackButton";
import Footer from "~/components/Footer";

const SignIn = () => {
  const handleSignUpGitHub = async () => {
    await signIn("github");
  };

  const handleSignUpGoogle = async () => {
    await signIn("google");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <BackButton />
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
          Sign in with GitHub
        </button>
        <button
          onClick={handleSignUpGoogle}
          className="flex w-full items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-white"
        >
          <i className="fab fa-google mr-2"></i>
          Sign in with Google
        </button>
      </div>
      <p className="mt-4">
        {`Haven't had an account?{" "}`}
        <Link href="/signup" className="text-indigo-700">
          Sign up.
        </Link>
      </p>

      <Footer />
    </div>
  );
};

export default SignIn;
