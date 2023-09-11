import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";

import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";

import { viVN } from "@clerk/localizations";
import TopNav from "~/components/TopNav";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isHome, setIsHome] = useState(router.asPath === "/");

  useEffect(() => {
    function handleRouteChange(url: string) {
      setIsHome(url === "/");
    }

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  return (
    <ClerkProvider localization={viVN} {...pageProps}>
      <Head>
        <title>classWhisper</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="UTF-8" />
      </Head>

      <div className="flex flex-col ">
        <div className="mx-auto w-screen">
          {isHome ? null : <TopNav />}
          <div className="flex-grow">
            <Component {...pageProps} />
          </div>
        </div>
      </div>
    </ClerkProvider>
  );
}

export default api.withTRPC(MyApp);
