import Link from "next/link";

const MainContent = () => (
  <main className="mt-5 flex-grow p-2">
    <div className="mb-4">
      <h2 className="text-xl font-bold">Relevant</h2>
      <div className="mt-4 space-y-4">
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="text-lg font-bold">DEV Challenge are Live 🚀</h3>
          <p className="mt-2 text-gray-700">
            Join us for the next Frontend Challenge: Recreation Edition...
          </p>
          <Link href="/dev-challenge" className="text-link-primary">
            Learn more
          </Link>
        </div>
        {/* Add more posts/cards */}
      </div>
    </div>
  </main>
);

export default MainContent;
