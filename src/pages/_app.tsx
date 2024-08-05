import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import NavBar from "~/components/NavBar";
import Footer from "~/components/Footer";
import Head from "next/head";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Dev</title>

        <meta
          name="description"
          content="A blogging platform similar to dev.to using create-t3-app"
        />
        <meta name="description" content="" />

        <link rel="icon" href="/dev.ico" />
      </Head>
      <div className={GeistSans.className}>
        <div className="mx-auto max-w-10xl">
          <NavBar />
        </div>
        <div>
          <div className="flex min-h-screen justify-center bg-gray-100">
            <div className="max-w-10xl">
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
