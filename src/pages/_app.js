import "../styles/globals.css";

import { Partytown } from "@builder.io/partytown/react";
import Head from "next/head";
import Link from "next/link";

// Change font import here
import { JetBrains_Mono } from "next/font/google";

const jetBrains_Mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <Partytown debug={true} forward={["dataLayer.push"]} />
        <title>Dishant Miyani</title>
        <link rel="stylesheet" type='text/css' href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="twitter:title" content="Dishant Miyani" />
        <meta
          name="twitter:description"
          content="My personal portfolio website."
        />{" "}
        <meta name="subject" content="web development" />
      </Head>

      <Link href="#main-content" className="sr-only focus:not-sr-only text-sm">
        Skip to main content
      </Link>
      <Component
        {...pageProps}
        className={`${jetBrains_Mono.className} ${jetBrains_Mono.variable}`}
      />
    </>
  );
}
