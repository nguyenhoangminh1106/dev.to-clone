import { useRouter } from "next/router";

/**
 * BACK BUTTON
 * - Return to previous page
 * 
 * @returns 
 */
const BackButton = () => {
  const router = useRouter();

  return (
    <div className="z-40 mx-2 my-1">
      <button onClick={() => router.back()} className="button-secondary">
        Back
      </button>
    </div>
  );
};

export default BackButton;
