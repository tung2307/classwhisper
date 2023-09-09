import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";

import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";

import { viVN } from "@clerk/localizations";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider localization={viVN} {...pageProps}>
      <Head>
        <title>classWhisper</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col ">
        <div className="mx-auto w-screen">
          <div className="flex-grow">
            {/* Add a Provider or context here to bypass authentication if necessary */}
            <Component {...pageProps} />
          </div>
        </div>
      </div>
    </ClerkProvider>
  );
}

export default api.withTRPC(MyApp);
