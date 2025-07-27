import "../styles/globals.css";

import { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { JetBrains_Mono } from "next/font/google";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import type { AppProps } from "next/app";

const jetBrains_Mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      person_profiles: "identified_only",
      defaults: "2025-05-24",
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") posthog.debug();
      },
    });
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <>
        <Head>
          <title>Dishant Miyani</title>
          <meta name="robots" content="all" />
          <meta name="description" content="My personal portfolio website." />
          <meta name="theme-color" content="#fffffff" />
          <meta httpEquiv="content-language" content="en" />
          <meta httpEquiv="content-type" content="text/html; charset=UTF-8" />
          <meta property="og:title" content="Dishant Miyani" />
          <meta
            property="og:description"
            content="My personal portfolio website."
          />
          <meta property="og:type" content="website" />
          <meta
            name="keywords"
            content="Dishant Miyani, SaaS Creator, Portfolio, Blog, web development, Dishant, front end development, SaaS Creator, AI Enginner, AI"
          />
          <meta name="author" content="Dishant Miyani" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="twitter:title" content="Dishant Miyani" />
          <meta
            name="twitter:description"
            content="My personal portfolio website."
          />{" "}
          <meta name="subject" content="web development" />
        </Head>

        <Link
          href="#main-content"
          className="sr-only focus:not-sr-only text-sm"
        >
          Skip to main content
        </Link>
        <Component
          {...pageProps}
          className={`${jetBrains_Mono.className} ${jetBrains_Mono.variable}`}
        />
      </>
    </PostHogProvider>
  );
}
