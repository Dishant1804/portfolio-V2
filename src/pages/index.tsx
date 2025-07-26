import Head from "next/head";
import { GetStaticProps } from "next";

import { getAllPosts } from "@/lib/blog";

import Header from "@/components/Header";

import { motion } from "motion/react";
import Landing from "@/components/Landing";
import type { Post } from "@/types/blog";

interface HomeProps {
  posts: Post[];
}

export default function Home({ posts }: HomeProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      filter: "blur(10px)",
      y: 20,
    },
    show: {
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
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
          content="Dishant Miyani, SaaS Creator, Portfolio, Blog, web development, Dishant, front end development, SaaS Creator"
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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col py-10 basics-prose gap-16 border border-t-0 border-b-0"
      >
        <motion.div variants={itemVariants}>
          <Header />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Landing posts={posts} />
        </motion.div>
      </motion.div>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const posts = getAllPosts();
  return {
    props: {
      posts,
    },
  };
};
