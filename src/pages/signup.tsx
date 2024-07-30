import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SignUp = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      void router.push("/");
    }
  }, [session, router]);

  const handleSignUp = async () => {
    await signIn("github");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1 className="text-3xl font-bold">Join the DEV Community</h1>
      <p className="mb-4 text-gray-700">
        DEV Community is a community of amazing developers
      </p>
      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={handleSignUp}
          className="flex w-full items-center justify-center rounded-lg bg-black px-4 py-2 text-white"
        >
          <i className="fab fa-github mr-2"></i>
          Sign up with GitHub
        </button>
        <button
          onClick={handleSignUp}
          className="flex w-full items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-white"
        >
          <i className="fab fa-google mr-2"></i>
          Sign up with Google
        </button>
      </div>
      <p className="mt-4">
        Already have an account?{" "}
        <a href="/signin" className="text-indigo-700">
          Log in.
        </a>
      </p>
    </div>
  );
};

export default SignUp;
