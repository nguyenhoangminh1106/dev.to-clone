import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import NavBar from "~/components/NavBar";
import Footer from "~/components/Footer";
import Head from "next/head";
import LoadingBar from "react-top-loading-bar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // START VALUE - WHEN LOADING WILL START
    router.events.on("routeChangeStart", () => {
      setProgress(40);
    });

    // COMPLETE VALUE - WHEN LOADING IS FINISHED
    router.events.on("routeChangeComplete", () => {
      setProgress(100);
    });
  }, []);

  return (
    <SessionProvider session={session}>
      <Head>
        <title>Dev Community</title>

        <meta
          name="description"
          content="A blogging platform similar to dev.to using create-t3-app"
        />
        <meta name="description" content="" />

        <link rel="icon" href="/dev.ico" />
      </Head>
      <div className="font-sans">
        <div className="mx-auto max-w-10xl">
          <NavBar />
        </div>
        <div>
          <div className="flex min-h-screen justify-center bg-gray-100">
            <div className="w-full max-w-10xl">
              <LoadingBar
                color="rgb(67 56 202)"
                progress={progress}
                waitingTime={500}
                onLoaderFinished={() => {
                  setProgress(0);
                }}
              />
              <Component {...pageProps} />
            </div>
          </div>
        </div>
        <div className="border-t border-gray-300 bg-gray-100">
          <div className="mx-auto max-w-10xl">
            <Footer />
          </div>
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
