import { signIn, signOut, useSession } from "next-auth/react";

/**
 * AUTH BUTTON
 * - Sign in / Sign out
 * 
 * @returns 
 */
export default function AuthButton() {
  const { data: session, status } = useSession();
  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You must be signed in to view this page</p>;

  return (
    <div>
      {/* Not signed in */}
      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
      {/* Already signed in */}
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </div>
  );
}
