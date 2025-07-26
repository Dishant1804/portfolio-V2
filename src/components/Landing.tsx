"use client";

import { Divider } from "./ui/divider";
import Experience from "./Experience";
import Projects from "./Projects";
import PullRequests from "./PullRequests";
import Blogs from "./Blogs";
import TechStack from "./TechStack";
import type { Post } from "@/types/blog";

interface LandingProps {
  posts: Post[];
}

export default function Landing({ posts }: LandingProps) {
  return (
    <>
      <article className="flex justify-between flex-col flex-wrap text-left font-medium relative">
        <div className="flex justify-between flex-col gap-16 text-left relative z-10">
          <Divider />
          <Experience />
          <Divider />
          <Projects />
          <Divider />
          <PullRequests />
          <Divider />
          <TechStack />
          <Divider />
          <Blogs posts={posts} />
        </div>
      </article>
    </>
  );
}
